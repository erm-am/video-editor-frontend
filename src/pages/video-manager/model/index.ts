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

// Привязываем container
sample({
  clock: getLibraryElementsFx.doneData,
  fn: (elements) => {
    return elements.map((element, index) => ({ ...element, container: 'library', index } as LibraryElement));
  },
  target: $libraryElements,
});

// Логика и математика перемещений
sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: [moveLibraryElementToRootContainer, moveLibraryElementToTimelineContainer],

  fn({ timelineElements }, payload) {
    const isMovingToRight = payload.isMovingToRight;
    const element = createTimelineElement(payload.source.data);
    const offset = calculateOffsetFromContainerStart(payload);
    const level = applyLevel(payload.target.data.level as number, payload.target.data.edgePosition as Edge);
    const elementsByLevel = timelineElements[level] ?? [];
    const elementWithParams = {
      ...element,
      params: {
        offset: offset,
        width: element.duration,
      },
    };
    const updatedElements = elementsByLevel.concat(elementWithParams);
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
  clock: moveLibraryElementToTimelineElement,

  fn({ timelineElements }, payload) {
    const source = payload.source.data as LibraryElement;
    const target = payload.target.data;
    const isMovingToRight = payload.isMovingToRight;
    const edgePosition = getEdgePosition(payload.edgePosition);
    const level = (target.level as number) ?? 0;
    const elementsByLevel = timelineElements[level] ?? [];

    if (edgePosition === 'left') {
      // todo: dry
      const updatedOffset = elementsByLevel[target.index as number].params.offset - source.duration;
      const element = createTimelineElement(payload.source.data);
      const params = {
        offset: updatedOffset,
        width: element.duration,
      };
      const elementWithParams = { ...element, params };
      const updatedElements = insertElement(elementsByLevel, target.index, elementWithParams);
      return {
        timelineElementsByLevel: updatedElements,
        level,
        isMovingToRight,
        reindexMode: 'before' as const,
      };
    } else if (edgePosition === 'right') {
      // todo: dry
      const updatedOffset = elementsByLevel[target.index as number].params.width + elementsByLevel[target.index as number].params.offset;
      const element = createTimelineElement(payload.source.data);
      const params = {
        offset: updatedOffset,
        width: element.duration,
      };
      const elementWithParams = { ...element, params };
      const updatedElements = insertElement(elementsByLevel, (target.index as number) + 1, elementWithParams);
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
    const elementsByLevel = timelineElements[level] ?? [];
    const updatedElements = elementsByLevel.map((element) => {
      const moveDistance = payload.inputs.current.clientX - payload.inputs.initial.clientX;
      const updatedOffset = element.params.offset + moveDistance;
      const params = { ...element.params, offset: updatedOffset };
      return element.localId === payload.source.data.localId ? { ...element, params } : element;
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
    const elementsByLevel = timelineElements[level] ?? [];

    const reorderedElements = reorderElement({
      elements: elementsByLevel,
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
    const element = createTimelineElement(payload.source.data);
    const isMovingToRight = payload.isMovingToRight;
    const offset = calculateOffsetFromContainerStart(payload);
    const level = (payload.target.data.level as number) ?? 0;
    const params = {
      offset: offset,
      width: element.duration,
    };

    const elementsByLevel = timelineElements[level] ?? [];
    const elementWithParams = { ...element, params };
    const updatedElements = elementsByLevel.concat(elementWithParams);
    return {
      timelineElementsByLevel: updatedElements,
      mediaElement: elementWithParams,
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
