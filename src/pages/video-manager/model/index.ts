import { sample } from 'effector';
import { v4 } from 'uuid';
import {
  $mediaElementsInTimeline,
  MediaLibraryGate,
  getMediaElementsFx,
  insertMediaElementIntoRootContainer,
  libraryMediaElementToRootContainer,
} from './model.effector';
import { createTimelineMediaElement } from './utils';

sample({
  clock: MediaLibraryGate.open,
  target: getMediaElementsFx,
});

sample({
  source: {
    mediaElementsInTimeline: $mediaElementsInTimeline,
  },
  clock: libraryMediaElementToRootContainer,
  filter: ({ mediaElementsInTimeline }, payload) => {
    return mediaElementsInTimeline.length === 0;
  },
  fn({ mediaElementsInTimeline }, payload) {
    return createTimelineMediaElement(payload.source.data);
  },
  target: insertMediaElementIntoRootContainer,
});
