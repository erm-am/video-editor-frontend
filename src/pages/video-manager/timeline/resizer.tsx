import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { css } from '@emotion/react';

export const Resizer = ({ media, isActive }) => {
  const leftRef = useRef();
  const rightRef = useRef();
  useEffect(() => {
    return combine(
      draggable({
        element: leftRef.current,
        getInitialData: () => ({ ...media, type: `${media.type}.LEFT` }),
      }),
      draggable({
        element: rightRef.current,
        getInitialData: () => ({ ...media, type: `${media.type}.RIGHT` }),
      }),
    );
  }, []);

  return (
    <ResizerContainer>
      <ResizerActions isActive={isActive}>
        <Left ref={leftRef} />
        <Right ref={rightRef} />
      </ResizerActions>
    </ResizerContainer>
  );
};

const ResizerActions = styled.div<{ isActive: boolean }>`
  border: 4px solid #3fa3ff;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  display: none
    ${(props) =>
      props.isActive &&
      css`
        display: block;
      `};
`;

const ResizerContainer = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  position: absolute;
  &:hover {
    ${ResizerActions} {
      display: block;
    }
  }
`;

const Left = styled.div`
  width: 12px;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #3fa3ff;
  position: absolute;
  cursor: col-resize;
`;

const Right = styled.div`
  width: 12px;
  top: 0;
  right: 0;
  height: 100%;
  background-color: #3fa3ff;
  position: absolute;
  cursor: col-resize;
`;
