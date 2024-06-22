import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import {
  $timelineElements,
  TimelineGate,
  moveLibraryElementToRootContainer,
  moveLibraryElementToTimelineContainer,
  moveLibraryElementToTimelineElement,
  moveTimelineElementToTimelineContainer,
  moveTimlineMediaElement,
  reorderTimelineMediaElement,
} from '../model/model.effector';
import { useGate, useUnit } from 'effector-react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { createRootContainerData, extractPayloadDragData, getDragRoute, getElementPosition } from '../model/utils';
import { TimelineGroup } from './group';
export const Timeline = () => {
  useGate(TimelineGate);
  const timelineElements = useUnit($timelineElements);
  const timelineContainerRef = useRef();
  useEffect(() => {
    return combine(
      dropTargetForElements({
        element: timelineContainerRef.current,
        canDrop: () => Object.keys(timelineElements).length === 0,
        getData: (data) => createRootContainerData(data),
      }),
      monitorForElements({
        onDrop(payload) {
          const extractedDragData = extractPayloadDragData(payload);
          // TODO: - library.* parser
          const currentDragRoute = getDragRoute({ source: extractedDragData.source, target: extractedDragData.target });
          if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'root') {
            moveLibraryElementToRootContainer(extractedDragData);
          } else if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'timeline') {
            moveLibraryElementToTimelineContainer(extractedDragData);
          } else if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'timeline.video') {
            moveLibraryElementToTimelineElement(extractedDragData);
          } else if (currentDragRoute.from === 'timeline.video' && currentDragRoute.to === 'timeline') {
            moveTimelineElementToTimelineContainer(extractedDragData);
          } else if (currentDragRoute.from === 'timeline.video' && currentDragRoute.to === 'timeline.video') {
            const { isSelf, isNear } = getElementPosition({
              from: extractedDragData.source.data,
              to: extractedDragData.target.data,
              edgePosition: extractedDragData.edgePosition.position,
            });
            if (isSelf || isNear) {
              moveTimlineMediaElement(extractedDragData);
            } else {
              reorderTimelineMediaElement(extractedDragData);
            }
          }
        },
      }),
    );
  }, []);
  return (
    <TimelineMainContainer ref={timelineContainerRef}>
      {timelineElements &&
        Object.entries(timelineElements).map(([level, elements]) => {
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
