import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ImageMedia, LibraryElement, Media, TimelineElement, VideoMedia } from '../types';
import styled from '@emotion/styled';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { css } from '@emotion/react';

import { Resizer } from './resizer';
import { getDragRoute, getElementPosition } from '../utils/dataManipulation';
import { Button } from '@/shared/ui/button';
import { TimelineMediaElement } from '../model/types';
import { VideoTimelineElement } from './video';
import { createTimelineContainerData, extractEdgePosition } from '../model/utils';
import { Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { useThrottle } from '@/shared/hooks/use-throttle';

type TimelineGroupProps = {
  timelineMediaElements: TimelineMediaElement[];
  groupIndex: number;
};

export const TimelineGroup: React.FC<TimelineGroupProps> = ({ timelineMediaElements, groupIndex }) => {
  const [edgePosition, setEdgePosition] = useState(null);
  const timelineGroupContainerRef = useRef();

  useEffect(() => {
    return combine(
      dropTargetForElements({
        element: timelineGroupContainerRef.current,

        onDrag: (eventPayload) => {
          const source = eventPayload.source;
          const target = eventPayload.self;
          const currentDragRoute = getDragRoute({ source, target });

          if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'timeline') {
            const edgePosition = extractEdgePosition(target.data as { element: Element; input: Input });
            if (edgePosition.vertical > 95 && edgePosition.horizontal > 5 && edgePosition.horizontal < 95) {
              setEdgePosition('top');
            } else if (edgePosition.vertical < 5 && edgePosition.horizontal > 5 && edgePosition.horizontal < 95) {
              setEdgePosition('bottom');
            } else {
              setEdgePosition(null);
            }
          } else if (currentDragRoute.from === 'timeline.video' && currentDragRoute.to === 'timeline.video') {
            // const { isSelf, isNear } = getElementPosition({ from: source.data, to: target.data, edgePosition });
            // if (!isSelf && !isNear) {
            //   setEdgePosition(edgePosition);
            // }
          }
        },
        onDragLeave: () => setEdgePosition(null),
        onDrop: () => setEdgePosition(null),

        getData: ({ element, input }) => {
          return createTimelineContainerData({ groupIndex, element, input });
        },
      }),
    );
  }, []);

  return (
    <TimelineGroupContainer ref={timelineGroupContainerRef}>
      {timelineMediaElements.map((media, index) => {
        if (media.type === 'video')
          return (
            <VideoTimelineElement disableEdge={!!edgePosition} media={media} index={index} groupIndex={groupIndex} key={media.localId} />
          );
      })}

      {edgePosition && <Line edgePosition={edgePosition} />}
    </TimelineGroupContainer>
  );
};

const TimelineGroupContainer = styled.div`
  background: gray;
  border: 1px solid red;
  width: 100%;
  height: 100px;
  position: relative;
`;

const Line = styled.div<{ edgePosition: 'top' | 'bottom' }>`
  height: 10px;
  width: 100%;

  position: absolute;
  z-index: 1300;

  ${(props) =>
    props.edgePosition === 'top' &&
    css`
      background-color: red;
      left: 0;
      top: 0;
    `}

  ${(props) =>
    props.edgePosition === 'bottom' &&
    css`
      background-color: green;
      left: 0;
      bottom: 0;
    `}
`;
