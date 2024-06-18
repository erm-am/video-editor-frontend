import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
export type MediaType = 'VIDEO' | 'AUDIO' | 'IMAGE' | 'TEXT';

export enum MediaContainerType {
  MEDIA_LIBRARY = 'MEDIA_LIBRARY',
  TIMELINE = 'TIMELINE',
}
type MediaBase = {
  id: string;
  type: MediaType;
  src: string;
  index: number;
};

type ExtendedMedia<T> = MediaBase & T;

export type VideoMedia = ExtendedMedia<{
  type: 'VIDEO';
  resolution: {
    width: number;
    height: number;
  };
  duration: number; // длительность видео в сек.
  size?: number; // размер видео на "полотне" (расчитывается на основе duration и changedValues.duration )
  changedValues: {
    duration: {
      left: 0; // обрезанное кол-во сек. по левому краю
      right: 0; //  обрезанное кол-во сек. по правому краю
    };
  };
}>;
export type ImageMedia = ExtendedMedia<{
  type: 'IMAGE';
  size: {
    width: number;
    height: number;
  };
}>;

export type Media = VideoMedia | ImageMedia;

export type TimelineElement = Media & {
  index?: number;
  offset: number;
  localId: string;
  container: 'timeline';
};
export type LibraryElement = Media & {
  index: number;
  container: 'library';
};

export type ReorderOptions = {
  items: (VideoMedia & TimelineElement)[]; //todo
  fromIndex: number;
  toIndex: number;
  edgePosition: Edge;
  isMovingToRight: boolean;
};

export type InsertMediaOptions<T> = {
  items: Array<T>;
  targetIndex: number;
  edgePosition: Edge;
  insertedMediaItem: Record<string, any>; //todo
};

type CollisionType = 'NEGATIVE_LEFT_OFFSET' | 'OVERLAP';
export type Collision = {
  type: CollisionType;
  indexes: [number, number];
};
