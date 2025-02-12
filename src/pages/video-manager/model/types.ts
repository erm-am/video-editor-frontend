import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';
import { DropTargetRecord, Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

export type CollisionType = 'out_of_bounds' | 'rectangle_intersection';
export type Collision = {
  type: CollisionType;
  indexes: [number, number];
};

export type MediaType = 'video' | 'audio' | 'image' | 'text';
export type ContainerType = 'library' | 'timeline' | 'root';
export type MediaBase = {
  id: string;
  type: MediaType;
  src: string;
  index: number;
};
export type Media<T> = MediaBase & T;
export type VideoProperties = {
  type: 'video';
  resolution: {
    width: number;
    height: number;
  };
  duration: number;
};
export type AudioProperties = {
  type: 'audio';
  duration: number;
};

export type VideoMedia = Media<VideoProperties>;
export type AudioMedia = Media<AudioProperties>;
export type MediaElement = VideoMedia | AudioMedia;

export type MediaContainerBase<T extends MediaElement, ContainerName extends ContainerType> = {
  container: ContainerName;
} & T;

export type VideoLibraryElement = MediaContainerBase<VideoMedia, 'library'>;
export type AudioLibraryElement = MediaContainerBase<AudioMedia, 'library'>;

export type VideoTimelineElement = MediaContainerBase<VideoMedia, 'timeline'> & { localId: string };
export type AudioTimelineElement = MediaContainerBase<AudioMedia, 'timeline'> & { localId: string };

export type ElementParams = {
  width: number;
  offset: number;
};
export type LibraryElement = VideoLibraryElement | AudioLibraryElement;
export type TimelineElement = (VideoTimelineElement | AudioTimelineElement) & {
  params: ElementParams;
};

// Utils
export type ReorderOptions = {
  elements: TimelineElement[];
  fromIndex: number;
  toIndex: number;
  edgePosition: Edge;
  isMovingToRight: boolean;
};

// Payload
export type DragDataPayload = {
  source: {
    data: Record<string, unknown>;
    element: {};
  };
  target: DropTargetRecord;
  inputs: {
    initial: Input;
    current: Input;
  };
  isMovingToRight: boolean;
  targets: {
    timeline: DropTargetRecord | {};
    media: DropTargetRecord | {};
    library: DropTargetRecord | {};
    root: DropTargetRecord | {};
  };
  edgePosition: {
    vertical: number;
    horizontal: number;
    position: Edge;
  };
};

export type UpdateTimelineElementsPayload = {
  timelineElements: TimelineElement[];
  level: number;
};
export type InsertTimelineElementPayload = {
  mediaElement: TimelineElement;
  level: number;
};

export type ResolveCollisionsPayload = {
  timelineElementsByLevel: TimelineElement[];
  level: number;
  isMovingToRight: boolean;
  reindexMode: 'after' | 'before';
};

export type RemoveMediaElementPayload = {
  localId: string;
  level: number;
};
