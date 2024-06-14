import { create } from 'zustand';
import { TimelineElement, VideoMedia } from '../types';
import { calculateOffsetForMediaLibraryToTimelineDrag, recalculate } from '../utils/calculations';
import { createTimelineMediaItem, insertMediaElement, reorderElement } from '../utils/dataManipulation';

type TimelineState = {
  mediaItems: TimelineElement[];
  selectedId: string;
  errors: string[] | null;
  isLoading: boolean;
};

type TimelineActions = {
  //TODO TYPES
  moveMediaLibraryToTimeline: (options: any) => string;
  moveTimelineVideoToTimeline: (options: any) => string;
  insertMediaElement: (options: any) => string;
  moveElement: (options: any) => string;
  reorderElement: (options: any) => string;
  resizeLeft: (options: any) => string;
  resizeRight: (options: any) => string;
  getMediaItems: (options: any) => void;
  removeMediaItem: (localId: string) => void;
  selectMediaItem: (localId: string) => void;
  reset: () => void;
};

const initState: TimelineState = {
  mediaItems: [],
  selectedId: null,
  errors: null,
  isLoading: false,
};
export const useTimelineStore = create<TimelineState & TimelineActions>((set, get) => ({
  ...initState,
  getMediaItems: async () => {},
  removeMediaItem: (localId: string) => {
    set((state) => {
      return { mediaItems: state.mediaItems.filter((mediaItem) => mediaItem.localId !== localId) };
    });
  },
  selectMediaItem: (localId: string) => {
    set({ selectedId: localId });
  },
  moveMediaLibraryToTimeline: ({ source, inputs, targets, isMovingToRight }) => {
    const updatedOffset = calculateOffsetForMediaLibraryToTimelineDrag({ target: targets.timeline, source, inputs });
    const createdTimelineMediaItem = createTimelineMediaItem({
      media: source.data,
      offset: updatedOffset,
    });
    set((state) => {
      const updatedTimelineMediaItems = [...state.mediaItems, createdTimelineMediaItem];
      return {
        mediaItems: recalculate({ items: updatedTimelineMediaItems, isMovingToRight, reindexMode: 'before' }),
      };
    });

    return createdTimelineMediaItem.localId;
  },
  moveTimelineVideoToTimeline: ({ source, inputs, isMovingToRight }) => {
    set((state) => {
      const updatedTimelineMediaItems = state.mediaItems.map((timelineMediaItem) => {
        const moveDistance = inputs.current.clientX - inputs.initial.clientX;
        const updatedOffset = timelineMediaItem.offset + moveDistance;
        return timelineMediaItem.localId === source.data.localId ? { ...timelineMediaItem, offset: updatedOffset } : timelineMediaItem;
      });
      return { mediaItems: recalculate({ items: updatedTimelineMediaItems, isMovingToRight, reindexMode: 'before' }) };
    });

    return source.data.localId;
  },
  insertMediaElement: ({ source, target, edgePosition, isMovingToRight }) => {
    const createdTimelineMediaItem = createTimelineMediaItem({
      media: source.data,
      offset: 0,
    });
    set((state) => {
      const updatedTimelineMediaItems = insertMediaElement({
        items: state.mediaItems,
        targetIndex: target.data.index,
        edgePosition: edgePosition,
        insertedMediaItem: createdTimelineMediaItem,
      });
      return {
        mediaItems: recalculate({ items: updatedTimelineMediaItems, isMovingToRight, reindexMode: 'before' }),
      };
    });
    return createdTimelineMediaItem.localId;
  },
  moveElement: ({ source, inputs, isMovingToRight }) => {
    set((state) => {
      const moveDistance = inputs.current.clientX - inputs.initial.clientX;
      const updatedTimelineMediaItems = state.mediaItems.map((timelineMediaItem) => {
        const updatedOffset = timelineMediaItem.offset + moveDistance;
        return timelineMediaItem.localId === source.data.localId ? { ...timelineMediaItem, offset: updatedOffset } : timelineMediaItem;
      });
      return {
        mediaItems: recalculate({ items: updatedTimelineMediaItems, isMovingToRight, reindexMode: 'before' }),
      };
    });
    return source.data.localId;
  },
  reorderElement: ({ source, target, edgePosition, isMovingToRight }) => {
    set((state) => {
      const updatedTimelineMediaItems = reorderElement({
        edgePosition: edgePosition,
        items: state.mediaItems,
        fromIndex: source.data.index,
        toIndex: target.data.index,
        isMovingToRight: isMovingToRight,
      });
      return {
        mediaItems: recalculate({
          items: updatedTimelineMediaItems,
          isMovingToRight: edgePosition === 'left' ? false : true,
          reindexMode: 'after',
        }),
      };
    });

    return source.data.localId;
  },
  resizeLeft: ({ source, inputs, isMovingToRight }) => {
    set((state) => {
      const moveDistance = inputs.initial.clientX - inputs.current.clientX;

      const updatedTimelineMediaItems = state.mediaItems.map((timelineMediaItem: VideoMedia & TimelineElement) => {
        if (timelineMediaItem.localId !== source.data.localId) {
          return timelineMediaItem;
        }
        const { left, right } = timelineMediaItem.changedValues.duration;
        const updatedOffset = timelineMediaItem.offset - moveDistance;
        return {
          ...timelineMediaItem,
          changedValues: {
            ...timelineMediaItem.changedValues,
            duration: { left: left + moveDistance, right },
          },
          offset: updatedOffset,
        };
      });
      return {
        mediaItems: recalculate({ items: updatedTimelineMediaItems, isMovingToRight, reindexMode: 'before' }),
      };
    });
    return source.data.localId;
  },
  resizeRight: ({ source, inputs, isMovingToRight }) => {
    set((state) => {
      const updatedTimelineMediaItems = state.mediaItems.map((timelineMediaItem: VideoMedia & TimelineElement) => {
        const { left, right } = timelineMediaItem.changedValues.duration;
        const moveDistance = (inputs.initial.clientX - inputs.current.clientX) * -1;
        return timelineMediaItem.localId === source.data.localId
          ? {
              ...timelineMediaItem,
              changedValues: {
                ...timelineMediaItem.changedValues,
                duration: { left, right: right + moveDistance },
              },
            }
          : timelineMediaItem;
      });
      return {
        mediaItems: recalculate({ items: updatedTimelineMediaItems, isMovingToRight, reindexMode: 'before' }),
      };
    });
    return source.data.localId;
  },
  reset: () => set(initState),
}));
