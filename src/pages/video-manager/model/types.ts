import { DropTargetRecord, Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

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

export type VideoLibraryMediaElement = MediaContainerBase<VideoMedia, 'library'>;
export type AudioLibraryMediaElement = MediaContainerBase<AudioMedia, 'library'>;
export type VideoTimelineMediaElement = MediaContainerBase<VideoMedia, 'timeline'> & { localId: string };
export type AudioTimelineMMediaElement = MediaContainerBase<AudioMedia, 'timeline'> & { localId: string };

export type LibraryMediaElement = VideoLibraryMediaElement | AudioLibraryMediaElement;
export type TimelineMediaElement = VideoLibraryMediaElement | AudioLibraryMediaElement;

//

///
///

export type ExtractedPayloadDragData = {
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
};
