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

export const $mediaElementsInTimeline = createStore<TimelineMediaElement[][]>([]); // Встроенные внутрь timeline

$mediaElements.on(getMediaElementsFx.doneData, (_, mediaLibrary) => {
  return mediaLibrary;
});

//events (from ui)
export const libraryMediaElementToRootContainer = createEvent<ExtractedPayloadDragData>();
export const libraryMediaElementToTimelineContainer = createEvent<ExtractedPayloadDragData>();
export const libraryMediaElementToTimelineMediaElement = createEvent<ExtractedPayloadDragData>();
export const timelineMediaElementToTimelineContainer = createEvent<ExtractedPayloadDragData>();
export const timelineMediaElementToTimelineMediaElement = createEvent<ExtractedPayloadDragData>();

//events
export const insertMediaElementIntoRootContainer = createEvent<TimelineMediaElement>();

$mediaElementsInTimeline.on(insertMediaElementIntoRootContainer, (_, payload) => {
  return [[payload]];
});
$mediaElementsInTimeline.watch((mediaElementsInTimeline) => {
  console.log('mediaElementsInTimeline', mediaElementsInTimeline);
});

//
//
//

$mediaElements.watch((mediaLibrary) => {
  console.log('mediaLibrary', mediaLibrary);
});
$mediaElementsInLibrary.watch((mediaLibrary) => {
  console.log('libraryMediaElements', mediaLibrary);
});
