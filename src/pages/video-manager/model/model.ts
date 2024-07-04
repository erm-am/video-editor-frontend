import { createEffect, createEvent, createStore } from 'effector';
import { createGate } from 'effector-react';
import { libraryElementsMockData } from './mock';
import {
  DragDataPayload,
  InsertTimelineElementPayload,
  LibraryElement,
  RemoveMediaElementPayload,
  ResolveCollisionsPayload,
  TimelineElement,
  UpdateTimelineElementsPayload,
} from './types';

//Gates

export const LibraryGate = createGate('LibraryGate');
export const TimelineGate = createGate('TimelineGate');

//Effects

export const getLibraryElementsFx = createEffect(() => Promise.resolve(libraryElementsMockData));

//Stores

export const $libraryElements = createStore<LibraryElement[]>([]);
export const $timelineElements = createStore<{
  [level: string]: TimelineElement[];
}>({});
export const $sortedTimelineElements = $timelineElements.map((timelineElements) => {
  return Object.entries(timelineElements).sort(([a], [b]) => parseInt(a) - parseInt(b));
});

export const $maxOffset = $sortedTimelineElements.map((timelineElements) => {
  const offsets = timelineElements.flatMap(([, elements]) => elements.map(({ params }) => params.width + params.offset));
  const maxOffset = Math.max(0, ...offsets);
  return maxOffset;
});

// Ui Events

export const moveLibraryElementToRootContainer = createEvent<DragDataPayload>(); // library.* -> root
export const moveLibraryElementToTimelineContainer = createEvent<DragDataPayload>(); // library.* -> timeline
export const moveLibraryElementToTimelineElement = createEvent<DragDataPayload>(); // library.* -> timeline.*
export const moveTimelineElementToTimelineElement = createEvent<DragDataPayload>(); // timeline.* <-> timeline.*
export const moveTimelineElementToTimelineContainer = createEvent<DragDataPayload>(); // timeline.* -> timeline
export const moveTimelineMediaElement = createEvent<DragDataPayload>(); // timeline.* <-> timeline.* (move)
export const reorderTimelineMediaElement = createEvent<DragDataPayload>(); // timeline.* <-> timeline.* (roorder)
export const removeMediaElement = createEvent<RemoveMediaElementPayload>(); // remove

// Model events

export const updateTimelineElements = createEvent<UpdateTimelineElementsPayload>();
export const insertTimelineElement = createEvent<InsertTimelineElementPayload>();
export const resolveCollisions = createEvent<ResolveCollisionsPayload>();

// Handlers

$timelineElements
  .on(insertTimelineElement, (state, { level, mediaElement }) => ({
    ...state,
    [level]: [...(state[level] || []), mediaElement],
  }))
  .on(updateTimelineElements, (state, { level, timelineElements }) => ({
    ...state,
    [level]: timelineElements,
  }))
  .on(removeMediaElement, (state, { level, localId }) => ({
    ...state,
    [level]: state[level].filter((element) => element.localId !== localId),
  }))
  .watch((data) => {
    console.log('watch:$timelineElements:', data);
  });
