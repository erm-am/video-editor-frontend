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
  moveTimlineMediaElement,
  moveTimelineElementToTimelineElement,
  reorderTimelineMediaElement,
  resolveCollisions,
  updateTimelineElements,
} from './model.effector';
import {
  calculateOffsetFromContainerStart,
  createTimelineMediaElement,
  insertElement,
  recalculate,
  reorderElement,
  unpackEdgePosition,
} from './utils';

import { LibraryElement } from './types';

sample({
  clock: LibraryGate.open,
  target: getLibraryElementsFx,
});

sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: [moveLibraryElementToRootContainer, moveLibraryElementToTimelineContainer],

  fn({ timelineElements }, payload) {
    const edgePosition = payload.edgePosition;

    const mediaElement = createTimelineMediaElement(payload.source.data);
    const isMovingToRight = payload.isMovingToRight;
    const offset = calculateOffsetFromContainerStart(payload);
    const level = (payload.target.data.level as number) ?? 0;
    const params = {
      offset: offset,
      width: mediaElement.duration,
    };

    const timelineElementsByLevel = timelineElements[level] ?? [];
    const mediaElementWitchParams = { ...mediaElement, params };
    const updatedElementsByLevel = timelineElementsByLevel.concat(mediaElementWitchParams);
    return {
      timelineElementsByLevel: updatedElementsByLevel,
      level,
      isMovingToRight,
      reindexMode: 'before' as const,
    };
  },
  target: resolveCollisions,
});

//library.* -> library.*
sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: moveLibraryElementToTimelineElement,

  fn({ timelineElements }, payload) {
    const source = payload.source.data as LibraryElement;
    const target = payload.target.data;
    const isMovingToRight = payload.isMovingToRight;
    const edgePosition = unpackEdgePosition(payload.edgePosition);
    const level = (target.level as number) ?? 0;
    const timelineElementsByLevel = timelineElements[level] ?? [];

    if (edgePosition === 'left') {
      const updatedOffset = timelineElementsByLevel[target.index as number].params.offset - source.duration;
      const mediaElement = createTimelineMediaElement(payload.source.data);
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
      const mediaElement = createTimelineMediaElement(payload.source.data);
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

//1. timeline.video -> timline
//2. Смещение
sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: [moveTimelineElementToTimelineContainer, moveTimlineMediaElement],

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

// reorder

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
      items: timelineElementsByLevel,
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

//timeline.video -> timeline.video
sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: moveTimelineElementToTimelineElement,

  fn({ timelineElements }, payload) {
    const edgePosition = payload.edgePosition;

    const mediaElement = createTimelineMediaElement(payload.source.data);
    const isMovingToRight = payload.isMovingToRight;
    const offset = calculateOffsetFromContainerStart(payload);
    const level = (payload.target.data.level as number) ?? 0;
    const params = {
      offset: offset,
      width: mediaElement.duration,
    };

    const timelineElementsByLevel = timelineElements[level] ?? [];
    const mediaElementWitchParams = { ...mediaElement, params };
    const updatedElementsByLevel = timelineElementsByLevel.concat(mediaElementWitchParams);
    return {
      timelineElementsByLevel: updatedElementsByLevel,
      mediaElement: mediaElementWitchParams,
      level,
      isMovingToRight,
      reindexMode: 'before' as const,
    };
  },
  target: resolveCollisions,
});

// COLLISIONS
sample({
  clock: resolveCollisions,
  fn(payload) {
    const { timelineElementsByLevel, level, isMovingToRight, reindexMode } = payload;
    const resolvedElementsByLevel = recalculate({
      items: timelineElementsByLevel,
      isMovingToRight,
      reindexMode,
    });
    return { timelineElements: resolvedElementsByLevel, level };
  },
  target: updateTimelineElements,
});
