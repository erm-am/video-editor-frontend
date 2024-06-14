import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ImageMedia, LibraryElement, Media, VideoMedia } from '../types';
import styled from '@emotion/styled';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { css } from '@emotion/react';

type DragAndDropWrapperProps = {
  children: ReactNode;
  media: Media;
};

export const DragAndDropWrapper: React.FC<DragAndDropWrapperProps> = ({ children, media }) => {
  const refDragAndDropContainer = useRef();
  const [dragging, setDragging] = useState<boolean>(false);
  useEffect(() => {
    return draggable({
      element: refDragAndDropContainer.current,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      getInitialData: () => media,
    });
  }, []);
  return (
    <DragAndDropContainer dragging={dragging} ref={refDragAndDropContainer}>
      {children}
    </DragAndDropContainer>
  );
};

const DragAndDropContainer = styled.div<{ dragging: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  width: 100px;
  height: 100px;

  ${(props) =>
    props.dragging &&
    css`
      opacity: 0.3;
    `}
`;
