import { useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractData, getDragRoute, getElementPosition } from '../utils/dataManipulation';
import { useTimelineStore } from './model';

export const useTimeline = ({ timelineContainerRef }) => {
  const timelineStore = useTimelineStore();
  useEffect(() => {
    return combine(
      dropTargetForElements({
        element: timelineContainerRef.current,
        getData: ({ input, element, source }) => {
          return { container: 'TIMELINE', input, element, source };
        },
      }),
      monitorForElements({
        onDrop(eventPayload) {
          const { source, target, targets, edgePosition, inputs, isMovingToRight } = extractData(eventPayload);
          const currentDragRoute = getDragRoute({ source, target });
          if (currentDragRoute.from === 'MEDIA_LIBRARY.VIDEO' && currentDragRoute.to === 'TIMELINE') {
            // Перемещение на пустую область timline
            timelineStore.moveMediaLibraryToTimeline({ source, inputs, targets, isMovingToRight });
          } else if (currentDragRoute.from === 'TIMELINE.VIDEO' && currentDragRoute.to === 'TIMELINE') {
            // Смещение на пустую область timline
            timelineStore.moveTimelineVideoToTimeline({ source, inputs, isMovingToRight });
          } else if (currentDragRoute.from === 'MEDIA_LIBRARY.VIDEO' && currentDragRoute.to === 'TIMELINE.VIDEO') {
            // Перемещения из коллекции на элемент внутри timline)
            timelineStore.insertMediaElement({ source, target, edgePosition, isMovingToRight });
          } else if (currentDragRoute.from === 'TIMELINE.VIDEO' && currentDragRoute.to === 'TIMELINE.VIDEO') {
            const { isSelf, isNear } = getElementPosition({ from: source.data, to: target.data, edgePosition });
            if (isSelf || isNear) {
              // Смещение элемента (на соседней элемент или на себя)
              timelineStore.moveElement({ source, inputs, isMovingToRight });
            } else {
              // Перестановка элемента через "edge-разделитель"
              timelineStore.reorderElement({ source, target, edgePosition, isMovingToRight });
            }
          } else if (
            currentDragRoute.from === 'TIMELINE.VIDEO.LEFT' &&
            (currentDragRoute.to === 'TIMELINE' || currentDragRoute.to === 'TIMELINE.VIDEO')
          ) {
            timelineStore.resizeLeft({ source, inputs, isMovingToRight });
          } else if (
            currentDragRoute.from === 'TIMELINE.VIDEO.RIGHT' &&
            (currentDragRoute.to === 'TIMELINE' || currentDragRoute.to === 'TIMELINE.VIDEO')
          ) {
            timelineStore.resizeRight({ source, inputs, isMovingToRight });
          }
        },
      }),
      autoScrollForElements({
        element: timelineContainerRef.current,
        getConfiguration: () => ({ maxScrollSpeed: 'standard' }),
      }),
    );
  }, [timelineStore.mediaItems]);

  return {
    mediaItems: timelineStore.mediaItems,
    selectedId: timelineStore.selectedId,
    removeMediaItem: timelineStore.removeMediaItem,
    selectMediaItem: timelineStore.selectMediaItem,
  };
};
