import { createEvent, sample, split } from 'effector';
import { v4 } from 'uuid';
import {
  $timelineElements,
  MediaLibraryGate,
  getMediaElementsFx,
  insertTimlineElement,
  moveLibraryMediaElementToRootContainer,
  moveLibraryMediaElementToTimelineContainer,
  resolveCollisions,
  updateTimelineElements,
} from './model.effector';
import { calculateOffsetFromContainerStart, createTimelineMediaElement, getDragRoute } from './utils';
import { calculateOffsetForMediaLibraryToTimelineDrag, recalculate } from '../utils/calculations';
import { useOnClickOutside } from '@/shared/hooks/use-on-click-outside';
import { MediaParams, TimelineMediaElement } from './types';

sample({
  clock: MediaLibraryGate.open,
  target: getMediaElementsFx,
});

//library.media -> root
//library.media -> timeline
sample({
  source: {
    timelineElements: $timelineElements,
  },
  clock: [moveLibraryMediaElementToRootContainer, moveLibraryMediaElementToTimelineContainer],

  fn({ timelineElements }, payload) {
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
      reindexMode: 'before',
    };
  },
  target: resolveCollisions,
});

sample({
  clock: resolveCollisions,
  fn(payload) {
    const { timelineElementsByLevel, level, isMovingToRight, reindexMode } = payload;
    const resolvedElementsByLevel = recalculate({ items: timelineElementsByLevel, isMovingToRight, reindexMode });
    console.log('resolvedElementsByLevel,resolvedElementsByLevel', resolvedElementsByLevel);
    return { timelineElements: resolvedElementsByLevel, level };
  },
  target: updateTimelineElements,
});
