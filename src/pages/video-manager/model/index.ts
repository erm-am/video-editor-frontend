import { sample } from 'effector';
import { v4 } from 'uuid';
import {
  $mediaElementsInTimeline,
  $positionRecords,
  MediaLibraryGate,
  getMediaElementsFx,
  insertMediaElementIntoRootContainer,
  insertMediaElementIntoTimelineContainer,
  movelibraryMediaElementToRootContainer,
} from './model.effector';
import { calculateOffsetFromContainerStart, createTimelineMediaElement } from './utils';
import { calculateOffsetForMediaLibraryToTimelineDrag } from '../utils/calculations';

sample({
  clock: MediaLibraryGate.open,
  target: getMediaElementsFx,
});

//добавление первого элемента
sample({
  source: {
    mediaElementsInTimeline: $mediaElementsInTimeline,
  },
  clock: movelibraryMediaElementToRootContainer,
  filter: ({ mediaElementsInTimeline }, payload) => {
    return mediaElementsInTimeline.length === 0;
  },
  fn({ mediaElementsInTimeline }, payload) {
    const isEmpty = mediaElementsInTimeline.length === 0;
    const mediaElement = createTimelineMediaElement(payload.source.data);
    const offset = calculateOffsetFromContainerStart(payload);
    const mediaProperties = {
      offset: offset,
      width: mediaElement.duration,
    };
    console.log('mediaProperties', mediaProperties);
    return { mediaElement, mediaProperties };
  },
  target: insertMediaElementIntoTimelineContainer,
});

// sample({
//   clock: createPositionRecord,
//   fn(payload) {
//     return payload;
//   },
//   target: calculateOffset,
// });

// sample({
//   source: {
//     mediaElementsInTimeline: $mediaElementsInTimeline,
//   },
//   clock: libraryMediaElementToTimelineContainer,
//   filter: ({ mediaElementsInTimeline }, payload) => {
//     return mediaElementsInTimeline.length > 0;
//   },
//   fn({ mediaElementsInTimeline }, payload) {
//     const { target, source, inputs, targets } = payload;
//     const groupIndex = target.data.groupIndex;
//     const offset = calculateOffsetForMediaLibraryToTimelineDrag({ target: targets.timeline, source, inputs });
//     const created = createTimelineMediaElement(payload.source.data);
//     return { createdElement: created, groupIndex: groupIndex as number, offset: offset as number };
//   },
//   target: createPositionRecord,
// });
