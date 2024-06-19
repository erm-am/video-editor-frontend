import { Store, combine, createEffect, createEvent, createStore } from 'effector';
import { createGate } from 'effector-react';
import { mediaElementsMockData } from './mock';
import { ExtractedPayloadDragData, LibraryMediaElement, MediaElement, MediaParams, TimelineMediaElement } from './types';
export const MediaLibraryGate = createGate('media library');
export const TimelineGate = createGate('timeline');

export const getMediaElementsFx = createEffect(() => Promise.resolve(mediaElementsMockData));
export const $libraryElements = createStore<MediaElement[]>([]); // оригинал  с сервера
export const $libraryElementsWithContainer: Store<LibraryMediaElement[]> = $libraryElements.map((libraryElements) =>
  libraryElements.map((libraryElement, index) => ({
    ...libraryElement,
    container: 'library',
    index,
  })),
);
$libraryElements.on(getMediaElementsFx.doneData, (_, mediaLibrary) => {
  return mediaLibrary;
});
///
///
/// UI events
export const moveLibraryMediaElementToRootContainer = createEvent<ExtractedPayloadDragData>();
export const moveLibraryMediaElementToTimelineContainer = createEvent<ExtractedPayloadDragData>();
export const removeMediaElement = createEvent<{ localId: string; level: number }>();

// local events
// local events
///
///

export const updateTimelineElements = createEvent<{
  timelineElements: (TimelineMediaElement & { params: MediaParams })[];
  level: number;
}>();
export const insertTimlineElement = createEvent<{ mediaElement: TimelineMediaElement & { params: MediaParams }; level: number }>();
export const resolveCollisions = createEvent<{
  timelineElementsByLevel: (TimelineMediaElement & { params: MediaParams })[];
  mediaElement: TimelineMediaElement & { params: MediaParams };
  level: number;
  isMovingToRight: boolean;
  reindexMode: string;
}>();

export const $timelineElements = createStore<{
  [level: string]: (TimelineMediaElement & { params: MediaParams })[];
}>({});

$timelineElements
  .on(insertTimlineElement, (state, payload) => {
    const level = payload.level;
    const mediaElement = payload.mediaElement;
    if (state[level]) {
      return { ...state, [level]: [...state[level], mediaElement] };
    } else {
      return { ...state, [level]: [mediaElement] };
    }
  })
  .on(updateTimelineElements, (state, payload) => {
    const level = payload.level;
    const timelineElements = payload.timelineElements;
    return { ...state, [level]: timelineElements };
  })
  .on(removeMediaElement, (state, payload) => {
    const localId = payload.localId;
    const level = payload.level;
    const updatedElements = state[level].filter((element) => element.localId !== localId);
    return { ...state, [level]: updatedElements };
  })
  .watch((data) => {
    console.log('_____timelineElements____', data);
  });

// export const $mediaParams = createStore<{ [name: string]: MediaParams }>({}); // оригинал  с сервера
// export const $mediaElementsInTimeline = createStore<TimelineMediaElement[][]>([]); // Встроенные внутрь timeline
// export const $mappedMediaElementsInTimeline = combine($mediaElementsInTimeline, $mediaParams, (mediaElementsInTimeline, mediaParams) => {
//   return mediaElementsInTimeline.map((group) => {
//     return group.map((mediaElement) => {
//       const id = mediaElement.localId;
//       if (mediaParams[id]) {
//         return { ...mediaElement, mediaParams: mediaParams[id] };
//       } else {
//         return mediaElement;
//       }
//     });
//   });
// });

//events (from ui)
// Все виды перемещений в UI

// $mediaElementsInTimeline
//   .on(insertMediaElement, (state, payload) => {
//     const mediaElement = payload.mediaElement;
//     const level = payload.params.level;
//     const updatedState = [...state];
//     if (updatedState[level]) {
//       updatedState[level].push(mediaElement);
//     } else {
//       updatedState[level] = [mediaElement];
//     }
//     return updatedState;
//   })
//   .on(removeMediaElement, (state, { localId, level }) => {
//     return state.map((group, index) => {
//       return index === level ? group.filter((media) => media.localId !== localId) : group;
//     });
//   })
//   .watch((data) => {
//     console.log('!!! $mediaElementsInTimeline !!!', data);
//   });
