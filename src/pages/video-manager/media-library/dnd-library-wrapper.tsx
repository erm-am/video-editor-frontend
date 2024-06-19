import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { css } from '@emotion/react';
import { LibraryMediaElement, VideoLibraryMediaElement } from '../model/types';

type DragAndDropWrapperProps = {
  children: ReactNode;
  media: LibraryMediaElement;
};
export const DndLibraryWrapper: React.FC<DragAndDropWrapperProps> = ({ children, media }) => {
  const refDragAndDropContainer = useRef();
  const refDragHandle = useRef();
  const [dragging, setDragging] = useState<boolean>(false);
  useEffect(() => {
    return draggable({
      element: refDragAndDropContainer.current,
      dragHandle: refDragHandle.current,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      getInitialData: () => media,
    });
  }, []);
  return (
    <DragAndDropContainer dragging={dragging} ref={refDragAndDropContainer}>
      {children}
      <Drag ref={refDragHandle}>111</Drag>
    </DragAndDropContainer>
  );
};

const DragAndDropContainer = styled.div<{ dragging: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid red;
  width: 100px;
  height: 40px;

  ${(props) =>
    props.dragging &&
    css`
      opacity: 0.3;
    `}
`;
const Drag = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  background: red;
  cursor: move;
  cursor: grab;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
