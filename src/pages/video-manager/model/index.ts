import { createEvent, sample, split } from 'effector';
import { v4 } from 'uuid';
import {
  $timelineElements,
  LibraryGate,
  getLibraryElementsFx,
  moveLibraryElementToRootContainer,
  moveLibraryElementToTimelineContainer,
  moveLibraryElementToTimelineElement,
  moveTimelineElementToTimelineContainer,
  moveTimelineMediaElement,
  moveTimelineElementToTimelineElement,
  reorderTimelineMediaElement,
  resolveCollisions,
  updateTimelineElements,
  $libraryElements,
} from './model';
import {
  calculateOffsetFromContainerStart,
  createTimelineElement,
  insertElement,
  recalculate,
  reorderElement,
  getEdgePosition,
  applyLevel,
} from './utils';
import { LibraryElement } from './types';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';

// Загрузка страницы
sample({
  clock: LibraryGate.open,
  target: getLibraryElementsFx,
});

// Привязываем к контейнеру library
sample({
  clock: getLibraryElementsFx.doneData,
  fn: (elements) => {
    return elements.map((element, index) => ({ ...element, container: 'library', index } as LibraryElement));
  },
  target: $libraryElements,
});

// Вся логика перемещений
sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: [moveLibraryElementToRootContainer, moveLibraryElementToTimelineContainer],

  fn({ timelineElements }, payload) {
    const isMovingToRight = payload.isMovingToRight;
    const mediaElement = createTimelineElement(payload.source.data);
    const offset = calculateOffsetFromContainerStart(payload);
    const level = applyLevel(payload.target.data.level as number, payload.target.data.edgePosition as Edge);
    const timelineElementsByLevel = timelineElements[level] ?? [];
    const mediaElementWithParams = {
      ...mediaElement,
      params: {
        offset: offset,
        width: mediaElement.duration,
      },
    };
    const updatedElementsByLevel = timelineElementsByLevel.concat(mediaElementWithParams);
    return {
      timelineElementsByLevel: updatedElementsByLevel,
      level,
      isMovingToRight,
      reindexMode: 'before' as const,
    };
  },
  target: resolveCollisions,
});

sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: moveLibraryElementToTimelineElement,

  fn({ timelineElements }, payload) {
    const source = payload.source.data as LibraryElement;
    const target = payload.target.data;
    const isMovingToRight = payload.isMovingToRight;
    const edgePosition = getEdgePosition(payload.edgePosition);
    const level = (target.level as number) ?? 0;
    const timelineElementsByLevel = timelineElements[level] ?? [];

    if (edgePosition === 'left') {
      const updatedOffset = timelineElementsByLevel[target.index as number].params.offset - source.duration;
      const mediaElement = createTimelineElement(payload.source.data);
      const params = {
        offset: updatedOffset,
        width: mediaElement.duration,
      };
      const mediaElementWithParams = { ...mediaElement, params };
      const updatedElements = insertElement(timelineElementsByLevel, target.index, mediaElementWithParams);
      return {
        timelineElementsByLevel: updatedElements,
        level,
        isMovingToRight,
        reindexMode: 'before' as const,
      };
    } else if (edgePosition === 'right') {
      const updatedOffset =
        (timelineElementsByLevel[target.index as number] as any).params.width +
        timelineElementsByLevel[target.index as number].params.offset;
      const mediaElement = createTimelineElement(payload.source.data);
      const params = {
        offset: updatedOffset,
        width: mediaElement.duration,
      };
      const mediaElementWithParams = { ...mediaElement, params };
      const updatedElements = insertElement(timelineElementsByLevel, (target.index as number) + 1, mediaElementWithParams);
      return {
        timelineElementsByLevel: updatedElements,
        level,
        isMovingToRight,
        reindexMode: 'before' as const,
      };
    }
  },
  target: resolveCollisions,
});

sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: [moveTimelineElementToTimelineContainer, moveTimelineMediaElement],

  fn({ timelineElements }, payload) {
    const isMovingToRight = payload.isMovingToRight;
    const level = (payload.target.data.level as number) ?? 0;
    const timelineElementsByLevel = timelineElements[level] ?? [];

    const updatedElements = timelineElementsByLevel.map((timelineMediaItem) => {
      const moveDistance = payload.inputs.current.clientX - payload.inputs.initial.clientX;
      const updatedOffset = timelineMediaItem.params.offset + moveDistance;
      const params = { ...timelineMediaItem.params, offset: updatedOffset };
      return timelineMediaItem.localId === payload.source.data.localId ? { ...timelineMediaItem, params } : timelineMediaItem;
    });

    return {
      timelineElementsByLevel: updatedElements,
      level,
      isMovingToRight,
      reindexMode: 'before' as const,
    };
  },
  target: resolveCollisions,
});

sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: reorderTimelineMediaElement,

  fn({ timelineElements }, payload) {
    const isMovingToRight = payload.isMovingToRight;
    const level = (payload.target.data.level as number) ?? 0;
    const timelineElementsByLevel = timelineElements[level] ?? [];

    const reorderedElements = reorderElement({
      elements: timelineElementsByLevel,
      edgePosition: payload.edgePosition.position,
      fromIndex: payload.source.data.index as number,
      toIndex: payload.target.data.index as number,
      isMovingToRight: isMovingToRight,
    });

    return {
      timelineElementsByLevel: reorderedElements,
      level,
      isMovingToRight: payload.edgePosition.position === 'left' ? false : true,
      reindexMode: 'after' as const,
    };
  },
  target: resolveCollisions,
});

sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: moveTimelineElementToTimelineElement,

  fn({ timelineElements }, payload) {
    const mediaElement = createTimelineElement(payload.source.data);
    const isMovingToRight = payload.isMovingToRight;
    const offset = calculateOffsetFromContainerStart(payload);
    const level = (payload.target.data.level as number) ?? 0;
    const params = {
      offset: offset,
      width: mediaElement.duration,
    };

    const timelineElementsByLevel = timelineElements[level] ?? [];
    const mediaElementWithParams = { ...mediaElement, params };
    const updatedElementsByLevel = timelineElementsByLevel.concat(mediaElementWithParams);
    return {
      timelineElementsByLevel: updatedElementsByLevel,
      mediaElement: mediaElementWithParams,
      level,
      isMovingToRight,
      reindexMode: 'before' as const,
    };
  },
  target: resolveCollisions,
});

// Поиск коллизий и переиндексация
sample({
  clock: resolveCollisions,
  fn(payload) {
    const { timelineElementsByLevel, level, isMovingToRight, reindexMode } = payload;
    const recalculatedElements = recalculate({
      elements: timelineElementsByLevel,
      isMovingToRight,
      reindexMode,
    });
    return { timelineElements: recalculatedElements, level };
  },
  target: updateTimelineElements,
});
