import React, { useEffect, useRef, useState } from 'react';
import { LibraryElement, TimelineElement, VideoMedia } from '../types';
import styled from '@emotion/styled';
import { DragAndDropWrapper } from './drag-and-drop-wrapper';
import { css } from '@emotion/react';
import { Button } from '@/shared/ui/button';

type VideoTimelineElementProps = {
  media: VideoMedia & TimelineElement;
  index: number;
  onRemove: (localId: string) => void;
  onSelect: (localId: string) => void;
  isActive: boolean;
};

export const VideoTimelineElement: React.FC<VideoTimelineElementProps> = ({ media, index, onRemove, isActive, onSelect }) => {
  return (
    <DragAndDropWrapper onRemove={onRemove} onSelect={onSelect} media={media} index={index} isActive={isActive}>
      <VideoTimelineElementContainer size={Math.max(0, media.size)}>
        <div>{media.offset}</div>
        <div>{media.id}</div>
        <div>{media.duration}</div>
        <div>{media.localId}</div>
      </VideoTimelineElementContainer>
    </DragAndDropWrapper>
  );
};

const VideoTimelineElementContainer = styled.div<{ size: number }>`
  display: flex;
  flex-direction: column;
  height: 100px;
  background-color: pink;

  ${(props) =>
    props.size &&
    css`
      width: ${props.size}px;
      min-width: ${props.size}px;
    `};
`;
