import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { css } from '@emotion/react';
import { Resizer } from './resizer';

import { Button } from '@/shared/ui/button';
import { TimelineElement } from '../model/types';
import { VideoElement } from './video-element';
import { createTimelineContainerData, getCoordinates, getDragRoute, getElementPosition } from '../model/utils';
import { Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';

type TimelineGroupProps = {
  elements: TimelineElement[];
  level: number;
  maxOffset: number;
};

export const TimelineGroup: React.FC<TimelineGroupProps> = ({ elements, level, maxOffset }) => {
  const [edgePosition, setEdgePosition] = useState(null);
  const timelineGroupContainerRef = useRef();

  const updateEdgePosition = useCallback((position: Edge) => {
    if (position === 'top' || position === 'bottom') {
      setEdgePosition(position);
    } else {
      setEdgePosition(null);
    }
  }, []);

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
            updateEdgePosition(coordinates.position);
          } else if (currentDragRoute.from === 'timeline.video' && currentDragRoute.to === 'timeline.video') {
            const { isSelf, isNear } = getElementPosition({ from: source.data, to: target.data, edgePosition });
            if (!isSelf && !isNear) {
              updateEdgePosition(coordinates.position);
            }
          }
        },
        onDragLeave: () => setEdgePosition(null),
        onDrop: () => setEdgePosition(null),
        getData: ({ element, input }) => {
          return createTimelineContainerData({ level, element, input, edgePosition });
        },
      }),
    );
  }, [edgePosition]);

  return (
    <TimelineGroupContainer width={Math.max(maxOffset, 800)} ref={timelineGroupContainerRef}>
      {elements.map((media: TimelineElement, index) => {
        if (media.type === 'video') return <VideoElement media={media} index={index} level={level} key={media.localId} />;
        // if (media.type === 'audio') return <AudioElement media={media} index={index} level={level} key={media.localId} />;
        // if (media.type === 'text') return <TextElement media={media} index={index} level={level} key={media.localId} />;
      })}
      {edgePosition && <Line edgePosition={edgePosition} />}
    </TimelineGroupContainer>
  );
};

const TimelineGroupContainer = styled.div<{ width: number }>`
  background: gray;
  display: flex;
  align-items: center;
  border: 1px solid red;
  width: 100%;
  height: 50px;
  position: relative;
  width: ${(props) => props.width}px;
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
