import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { css } from '@emotion/react';
import { Resizer } from './resizer';

import { Button } from '@/shared/ui/button';
import { TimelineElement } from '../model/types';
import { VideoTimelineElement } from './video';
import { createTimelineContainerData, getCoordinates, getDragRoute, getElementPosition } from '../model/utils';
import { Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

type TimelineGroupProps = {
  elements: TimelineElement[];
  level: number;
};

export const TimelineGroup: React.FC<TimelineGroupProps> = ({ elements, level }) => {
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
          const coordinates = getCoordinates(target.data as { element: Element; input: Input });
          if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'timeline') {
            if (coordinates.position === 'top') {
              setEdgePosition('top');
            } else if (coordinates.position === 'bottom') {
              setEdgePosition('bottom');
            } else {
              setEdgePosition(null);
            }
          } else if (currentDragRoute.from === 'timeline.video' && currentDragRoute.to === 'timeline.video') {
            const { isSelf, isNear } = getElementPosition({ from: source.data, to: target.data, edgePosition });
            if (!isSelf && !isNear) {
              if (coordinates.position === 'top') {
                setEdgePosition('top');
              } else if (coordinates.position === 'bottom') {
                setEdgePosition('bottom');
              } else {
                setEdgePosition(null);
              }
            }
          }
        },
        onDragLeave: () => setEdgePosition(null),
        onDrop: () => setEdgePosition(null),
        getData: ({ element, input }) => {
          return createTimelineContainerData({ level, element, input });
        },
      }),
    );
  }, []);

  return (
    <TimelineGroupContainer ref={timelineGroupContainerRef}>
      {elements.map((media: TimelineElement, index) => {
        if (media.type === 'video') return <VideoTimelineElement media={media} index={index} level={level} key={media.localId} />;
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
