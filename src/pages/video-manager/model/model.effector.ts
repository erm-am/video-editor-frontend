import { Store, combine, createEffect, createEvent, createStore } from 'effector';
import { createGate } from 'effector-react';
import { mediaElementsMockData } from './mock';
import { ExtractedPayloadDragData, LibraryMediaElement, MediaElement, TimelineMediaElement } from './types';

export const MediaLibraryGate = createGate('media library');
export const TimelineGate = createGate('timeline');

export const getMediaElementsFx = createEffect(() => Promise.resolve(mediaElementsMockData));
export const $mediaElements = createStore<MediaElement[]>([]); // оригинал  с сервера
export const $mediaElementsInLibrary: Store<LibraryMediaElement[]> = $mediaElements.map((mediaElement) =>
  mediaElement.map((mediaElement, index) => ({
    ...mediaElement,
    container: 'library',
    index,
  })),
);

export const $positionRecords = createStore<{ [name: string]: { offset; width } }>({}); // оригинал  с сервера

export const $mediaElementsInTimeline = createStore<TimelineMediaElement[][]>([]); // Встроенные внутрь timeline

$mediaElements.on(getMediaElementsFx.doneData, (_, mediaLibrary) => {
  return mediaLibrary;
});

//events (from ui)
// Все виды перемещений в UI

export type MoveDirection =
  | 'LIBRARY_MEDIA_ELEMENT_TO_ROOT_CONTAINER'
  | 'LIBRARY_MEDIA_ELEMENT_TO_TIMELINE_CONTAINER'
  | 'LIBRARY_MEDIA_ELEMENT_TO_TIMELINE_MEDIA_ELEMENT'
  | 'TIMELINE_MEDIA_ELEMENT_TO_TIMLINE_CONTAINER'
  | 'TIMELINE_MEDIA_ELEMENT_TO_TIMELINE_MEDIA_ELEMENT';

export const moveMediaElement = createEvent<{ data: ExtractedPayloadDragData; moveDirection: MoveDirection }>();

export const movelibraryMediaElementToRootContainer = createEvent<ExtractedPayloadDragData>();
export const movelibraryMediaElementToTimelineContainer = createEvent<ExtractedPayloadDragData>();
export const movelibraryMediaElementToTimelineMediaElement = createEvent<ExtractedPayloadDragData>();
export const movetimelineMediaElementToTimelineContainer = createEvent<ExtractedPayloadDragData>();
export const movetimelineMediaElementToTimelineMediaElement = createEvent<ExtractedPayloadDragData>();

//events
export const insertMediaElementIntoRootContainer = createEvent<{
  medialement: TimelineMediaElement;
}>();

export const insertMediaElementIntoTimelineContainer = createEvent<{
  mediaElement: TimelineMediaElement;
}>();

$mediaElementsInTimeline;
// .on(insertMediaElementIntoRootContainer, (_, payload) => {
//   return [[payload.createdElement]];
// })
// .on(insertMediaElementIntoTimelineContainer, (state, payload) => {
//   console.log('ДОБАВЛЯЕМ', payload);
//   state[payload.groupIndex].push(payload.createdElement);
//   return [...state];
// });

$mediaElementsInTimeline.watch((mediaElementsInTimeline) => {
  console.log('mediaElementsInTimeline', mediaElementsInTimeline);
});

//
//
//

$mediaElementsInLibrary.watch((mediaLibrary) => {
  console.log('libraryMediaElements', mediaLibrary);
});
$positionRecords.watch((positionRecords) => {
  console.log('positionRecords', positionRecords);
});
insertMediaElementIntoTimelineContainer.watch((data) => {
  console.log('insertMediaElementIntoTimelineContainer', data);
});
