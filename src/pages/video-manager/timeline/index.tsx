import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { VideoTimelineElement } from './video';
import { useTimeline } from './useTimeline';
import {
  $timelineElements,
  TimelineGate,
  moveLibraryMediaElementToRootContainer,
  moveLibraryMediaElementToTimelineContainer,
} from '../model/model.effector';
import { useGate, useUnit } from 'effector-react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractData, getElementPosition } from '../utils/dataManipulation';
import { ElementDragPayload, Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { createRootContainerData, extractPayloadDragData, getDragRoute } from '../model/utils';
import { TimelineGroup } from './group';

export const Timeline = () => {
  useGate(TimelineGate);
  const timelineElements = useUnit($timelineElements);

  const timelineMainContainerRef = useRef();
  useEffect(() => {
    return combine(
      dropTargetForElements({
        element: timelineMainContainerRef.current,
        canDrop: () => Object.keys(timelineElements).length === 0,
        getData: (data) => createRootContainerData(data),
      }),

      monitorForElements({
        onDrop(payload) {
          const extractedDragData = extractPayloadDragData(payload);
          console.log('extractedDragData', extractedDragData);
          const currentDragRoute = getDragRoute({ source: extractedDragData.source, target: extractedDragData.target });

          if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'root') {
            console.info('Перенесли элемент из Library.* в root контейнер (пустой контейнер)');

            moveLibraryMediaElementToRootContainer(extractedDragData);

            // Перемещение на пустую область timline
            //  timelineStore.moveMediaLibraryToTimeline({ source, inputs, targets, isMovingToRight });
          }
          if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'timeline') {
            console.info('Перенесли элемент из Library.* в timeline контейнер ');

            moveLibraryMediaElementToTimelineContainer(extractedDragData);
            //moveLibraryMediaElementToRootContainer(extractedDragData);
            // Перемещение на пустую область timline
            //  timelineStore.moveMediaLibraryToTimeline({ source, inputs, targets, isMovingToRight });
          }
        },
      }),
    );
  }, []);

  return (
    <TimelineMainContainer ref={timelineMainContainerRef}>
      {Object.entries(timelineElements).map(([level, elements]) => {
        return <TimelineGroup key={level} level={parseInt(level)} elements={elements} />;
      })}
    </TimelineMainContainer>
  );
};

const TimelineMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 400px;
  overflow: auto;
  background-color: #0e1317;
  position: relative;
`;
