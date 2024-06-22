import React, { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { DragAndDropWrapper } from './drag-and-drop-wrapper';
import { css } from '@emotion/react';
import { Button } from '@/shared/ui/button';
import { ElementParams, TimelineElement } from '../model/types';

type VideoTimelineElementProps = {
  media: TimelineElement & { params: ElementParams };
  level: number;
  index: number;
};

export const VideoTimelineElement: React.FC<VideoTimelineElementProps> = ({ media, level, index }) => {
  return (
    <DragAndDropWrapper media={media} index={index} level={level}>
      <VideoTimelineElementContainer>
        <Description>{media.index}</Description>
        <Description>{media.duration}</Description>
        <Description>{media.localId}</Description>
      </VideoTimelineElementContainer>
    </DragAndDropWrapper>
  );
};

const VideoTimelineElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100px;
  background-color: pink;
`;
const Description = styled.div`
  border: 1px solid black;
`;
