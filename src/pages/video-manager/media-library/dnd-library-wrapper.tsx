import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { css } from '@emotion/react';
import { LibraryElement } from '../model/types';

type DragAndDropWrapperProps = {
  children: ReactNode;
  media: LibraryElement;
};
export const DndLibraryWrapper: React.FC<DragAndDropWrapperProps> = ({ children, media }) => {
  const dragAndDropContainerRef = useRef();
  const dragHandleRef = useRef();
  const [dragging, setDragging] = useState<boolean>(false);
  useEffect(() => {
    return draggable({
      element: dragAndDropContainerRef.current,
      dragHandle: dragHandleRef.current,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      getInitialData: () => media,
    });
  }, []);
  return (
    <DragAndDropContainer dragging={dragging} ref={dragAndDropContainerRef}>
      {children}
      <Drag ref={dragHandleRef} />
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
  cursor: grab;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
