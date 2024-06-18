import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { VideoTimelineElement } from './video';
import { useTimeline } from './useTimeline';
import { $mediaElementsInTimeline, TimelineGate, libraryMediaElementToRootContainer } from '../model/model.effector';
import { useGate, useUnit } from 'effector-react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractData, getElementPosition } from '../utils/dataManipulation';
import { ElementDragPayload, Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { extractPayloadDragData, getDragRoute } from '../model/utils';

type RootContainerData = {
  container: 'root';
  input: Input;
  element: Element;
  source: ElementDragPayload;
};

const createRootContainerData = (data) => {
  return { ...data, container: 'root' };
};
export const Timeline = () => {
  useGate(TimelineGate);
  const mediaElementsInLibrary = useUnit($mediaElementsInTimeline);

  const timelineMainContainerRef = useRef();
  useEffect(() => {
    return combine(
      dropTargetForElements({
        element: timelineMainContainerRef.current,
        canDrop: () => mediaElementsInLibrary.length === 0,
        getData: (data) => createRootContainerData(data),
      }),

      monitorForElements({
        onDrop(payload) {
          const extractedDragData = extractPayloadDragData(payload);
          const currentDragRoute = getDragRoute({ source: extractedDragData.source, target: extractedDragData.target });
          if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'root') {
            console.info('Перенесли элемент из Library.* в root контейнер (пустой контейнер)');
            libraryMediaElementToRootContainer(extractedDragData);
            // Перемещение на пустую область timline
            //  timelineStore.moveMediaLibraryToTimeline({ source, inputs, targets, isMovingToRight });
          }
        },
      }),
    );
  }, []);

  return (
    <TimelineMainContainer ref={timelineMainContainerRef}>
      {/* {mediaItems.map((media, index) => {
        const isActive = media.localId === selectedId;
        if (media.type === 'VIDEO') {
          return (
            <VideoTimelineElement
              isActive={isActive}
              key={media.localId}
              index={index}
              media={media}
              onRemove={removeMediaItem}
              onSelect={selectMediaItem}
            />
          );
        }
        return <div>UNKNOWN_MEDIA_ELEMENT</div>;
      })} */}
    </TimelineMainContainer>
  );
};

const TimelineMainContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 800px;
  height: 400px;
  overflow: auto;
  background-color: #0e1317;
  position: relative;
`;
