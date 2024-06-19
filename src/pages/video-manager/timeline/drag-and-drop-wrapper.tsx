import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ImageMedia, LibraryElement, Media, TimelineElement, VideoMedia } from '../types';
import styled from '@emotion/styled';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { css } from '@emotion/react';

import { Resizer } from './resizer';

import { Button } from '@/shared/ui/button';
import { TimelineMediaElement } from '../model/types';
import { createTimelineContainerData, extractEdgePosition, getDragRoute, getElementPosition } from '../model/utils';
import { Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

type DragAndDropWrapperProps = {
  children: ReactNode;
  media: TimelineMediaElement;
  index: number;
  groupIndex: number;

  // isActive: boolean;
  // onSelect: (localId: string) => void;
  // onRemove: (localId: string) => void;
};

export const DragAndDropWrapper: React.FC<DragAndDropWrapperProps> = ({ children, media, index, groupIndex }) => {
  const refDragAndDropContainer = useRef();
  const [edgePosition, setEdgePosition] = useState(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    return combine(
      draggable({
        element: refDragAndDropContainer.current,
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
        getInitialData: () => ({ ...media, index }),
      }),

      dropTargetForElements({
        element: refDragAndDropContainer.current,
        onDrag: (eventPayload) => {
          const source = eventPayload.source;
          const target = eventPayload.self;
          const currentDragRoute = getDragRoute({ source, target });
          const edgePosition = extractEdgePosition(target.data as { element: Element; input: Input });
          if (currentDragRoute.from === 'library.video' && currentDragRoute.to === 'timeline.video') {
            if (edgePosition.horizontal > 95 && edgePosition.vertical > 5 && edgePosition.vertical < 95) {
              setEdgePosition('right');
            } else if (edgePosition.horizontal < 5 && edgePosition.vertical > 5 && edgePosition.vertical < 95) {
              setEdgePosition('left');
            } else {
              setEdgePosition(null);
            }
          } else if (currentDragRoute.from === 'timeline.video' && currentDragRoute.to === 'timeline.video') {
            const { isSelf, isNear } = getElementPosition({ from: source.data, to: target.data, edgePosition });
            if (!isSelf && !isNear) {
              //  setEdgePosition(edgePosition); // todo
            }
          }
        },
        onDragLeave: () => setEdgePosition(null),
        onDrop: () => setEdgePosition(null),
        getData: ({ input, element }) => {
          return createTimelineContainerData({ ...media, index, groupIndex, input, element });
        },
      }),
    );
  }, []);

  return (
    <DragAndDropContainer
      // data-id={media.localId}
      // offset={media.offset}
      // dragging={dragging}
      // onClick={() => onSelect(media.localId)}
      ref={refDragAndDropContainer}
    >
      {edgePosition && <Line edgePosition={edgePosition} />}
      {children}
      {/* <Resizer isActive={isActive} media={media} />
      <Remove onClick={() => onRemove(media.localId)}>remove</Remove> */}
    </DragAndDropContainer>
  );
};

// const DragAndDropContainer = styled.div<{ dragging: boolean; offset: number }>`
//   background: gray;
//   position: absolute;
//   left: ${(props) => props.offset}px;
//   ${(props) =>
//     props.dragging &&
//     css`
//       opacity: 0.3;
//     `}
// `;
const DragAndDropContainer = styled.div`
  background: gray;
  position: absolute;
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
