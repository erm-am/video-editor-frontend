import React, { useEffect, useRef, useState } from 'react';
import { LibraryElement, TimelineElement, VideoMedia } from '../types';
import styled from '@emotion/styled';
import { DragAndDropWrapper } from './drag-and-drop-wrapper';
import { css } from '@emotion/react';
import { Button } from '@/shared/ui/button';
import { TimelineMediaElement } from '../model/types';

type VideoTimelineElementProps = {
  media: TimelineMediaElement;
  groupIndex: number;
  index: number;
  disableEdge: boolean;
};

export const VideoTimelineElement: React.FC<VideoTimelineElementProps> = ({ media, groupIndex, index }) => {
  return (
    // <DragAndDropWrapper onRemove={onRemove} onSelect={onSelect}  size=""  media={media} index={index} isActive={isActive}>

    <DragAndDropWrapper media={media} index={index} groupIndex={groupIndex}>
      <VideoTimelineElementContainer>
        <div>{media.id}</div>
        <div>{media.duration}</div>
        <div>{media.localId}</div>
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
