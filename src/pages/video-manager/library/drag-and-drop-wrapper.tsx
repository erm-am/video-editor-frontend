import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { css } from '@emotion/react';
import { LibraryElement } from '../model/types';

type DragAndDropWrapperProps = {
  children: ReactNode;
  media: LibraryElement;
};
export const DragAndDropWrapper: React.FC<DragAndDropWrapperProps> = ({ children, media }) => {
  const containerRef = useRef();
  const dragHandleRef = useRef();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  useEffect(() => {
    return draggable({
      element: containerRef.current,
      dragHandle: dragHandleRef.current,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
      getInitialData: () => media,
    });
  }, []);
  return (
    <Container dragging={isDragging} ref={containerRef}>
      {children}
      <Drag ref={dragHandleRef} />
    </Container>
  );
};

const Container = styled.div<{ dragging: boolean }>`
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
