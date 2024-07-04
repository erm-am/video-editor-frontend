import React, { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { DragAndDropWrapper } from './drag-and-drop-wrapper';
import { css } from '@emotion/react';
import { Button } from '@/shared/ui/button';
import { TimelineElement } from '../model/types';

type VideoElementProps = {
  media: TimelineElement;
  level: number;
  index: number;
};

export const VideoElement: React.FC<VideoElementProps> = ({ media, level, index }) => {
  return (
    <DragAndDropWrapper media={media} index={index} level={level}>
      <VideoElementContainer>
        <Description>{media.index}</Description>
        <Description>{media.duration}</Description>
      </VideoElementContainer>
    </DragAndDropWrapper>
  );
};

const VideoElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 40px;
  background-color: pink;
`;
const Description = styled.div`
  border: 1px solid black;
`;
