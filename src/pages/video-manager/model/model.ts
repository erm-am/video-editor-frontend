import { Store, combine, createEffect, createEvent, createStore } from 'effector';
import { createGate } from 'effector-react';
import { libraryElementsMockData } from './mock';
import { ExtractedPayloadDragData, LibraryElement, MediaElement, ElementParams, TimelineElement } from './types';

//Gates
export const LibraryGate = createGate('LibraryGate');
export const TimelineGate = createGate('TimelineGate');

//Effects
export const getLibraryElementsFx = createEffect(() => Promise.resolve(libraryElementsMockData));

//Stores
export const $libraryElements = createStore<MediaElement[]>([]);
export const $libraryElementsWithContainer: Store<LibraryElement[]> = $libraryElements.map((libraryElements) =>
  libraryElements.map((libraryElement, index) => ({
    ...libraryElement,
    container: 'library',
    index,
  })),
);
export const $timelineElements = createStore<{
  [level: string]: TimelineElement[];
}>({});

/// Events
export const moveLibraryElementToRootContainer = createEvent<ExtractedPayloadDragData>(); // library.* -> root
export const moveLibraryElementToTimelineContainer = createEvent<ExtractedPayloadDragData>(); // library.* -> timeline
export const moveLibraryElementToTimelineElement = createEvent<ExtractedPayloadDragData>(); // library.* -> timeline.*
export const moveTimelineElementToTimelineElement = createEvent<ExtractedPayloadDragData>(); // timeline.* -> timeline.*
export const moveTimelineElementToTimelineContainer = createEvent<ExtractedPayloadDragData>(); // timeline.* -> timeline
export const moveTimlineMediaElement = createEvent<ExtractedPayloadDragData>(); // timeline.* -> timeline.* (move)
export const reorderTimelineMediaElement = createEvent<ExtractedPayloadDragData>(); // timeline.* -> timeline.* (roorder)
export const removeMediaElement = createEvent<{ localId: string; level: number }>(); // remove

// local events

export const updateTimelineElements = createEvent<{
  timelineElements: TimelineElement[];
  level: number;
}>();
export const insertTimelineElement = createEvent<{ mediaElement: TimelineElement; level: number }>();
export const resolveCollisions = createEvent<{
  timelineElementsByLevel: TimelineElement[];
  level: number;
  isMovingToRight: boolean;
  reindexMode: 'after' | 'before';
}>();

//Handlers
$libraryElements.on(getLibraryElementsFx.doneData, (_, mediaLibrary) => mediaLibrary);

$timelineElements
  .on(insertTimelineElement, (state, payload) => {
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
    console.log('_____timelineElements_____', data);
  });
