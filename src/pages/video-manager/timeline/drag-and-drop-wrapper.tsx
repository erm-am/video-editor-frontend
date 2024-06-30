import React, { ReactNode, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { css } from '@emotion/react';

import { Resizer } from './resizer';

import { Button } from '@/shared/ui/button';
import { TimelineElement } from '../model/types';
import { createTimelineContainerData, getCoordinates, getDragRoute, getElementPosition } from '../model/utils';
import { Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { removeMediaElement } from '../model/model';

type DragAndDropWrapperProps = {
  children: ReactNode;
  media: TimelineElement;
  index: number;
  level: number;
};

export const DragAndDropWrapper: React.FC<DragAndDropWrapperProps> = ({ children, media, index, level }) => {
  const refDragAndDropContainer = useRef();
  const [edgePosition, setEdgePosition] = useState(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    return combine(
      draggable({
        element: refDragAndDropContainer.current,
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
        getInitialData: () => ({ ...media, level, index }),
      }),

      dropTargetForElements({
        element: refDragAndDropContainer.current,
        onDrag: (eventPayload) => {
          const source = eventPayload.source;
          const target = eventPayload.self;
          const currentDragRoute = getDragRoute({ source, target });
          const coordinates = getCoordinates(target.data as { element: Element; input: Input });
          if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'timeline.video') {
            if (coordinates.position === 'right') {
              setEdgePosition('right');
            } else if (coordinates.position === 'left') {
              setEdgePosition('left');
            } else {
              setEdgePosition(null);
            }
          } else if (currentDragRoute.from === 'timeline.video' && currentDragRoute.to === 'timeline.video') {
            const { isSelf, isNear } = getElementPosition({ from: source.data, to: target.data, edgePosition });
            if (!isSelf && !isNear) {
              if (coordinates.position === 'right') {
                setEdgePosition('right');
              } else if (coordinates.position === 'left') {
                setEdgePosition('left');
              } else {
                setEdgePosition(null);
              }
            }
          }
        },
        onDragLeave: () => setEdgePosition(null),
        onDrop: () => setEdgePosition(null),
        getData: ({ input, element }) => {
          return createTimelineContainerData({ ...media, index, level, input, element });
        },
      }),
    );
  }, [index]);

  return (
    <DragAndDropContainer
      data-id={media.localId}
      offset={media.params.offset}
      width={media.params.width}
      dragging={dragging}
      ref={refDragAndDropContainer}
    >
      {edgePosition && <Line edgePosition={edgePosition} />}
      {children}
      {/* <Resizer isActive={isActive} media={media} />
       */}
      <Remove onClick={() => removeMediaElement({ localId: media.localId, level })}>remove</Remove>
    </DragAndDropContainer>
  );
};

const DragAndDropContainer = styled.div<{ offset: number; width: number; dragging: boolean }>`
  background: gray;
  position: absolute;
  width: ${(props) => props.width}px;
  left: ${(props) => props.offset}px;
  ${(props) =>
    props.dragging &&
    css`
      opacity: 0.3;
    `}
`;

const Line = styled.div<{ edgePosition: 'left' | 'right' }>`
  width: 4px;
  height: 100%;
  background-color: blue;
  position: absolute;
  z-index: 1100;
  top: 0;
  ${(props) =>
    props.edgePosition === 'right' &&
    css`
      background-color: red;
      right: 0;
    `}

  ${(props) =>
    props.edgePosition === 'left' &&
    css`
      background-color: blue;
      left: 0;
    `}
`;

const Remove = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
`;
