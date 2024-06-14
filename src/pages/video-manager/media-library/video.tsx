import React from 'react';
import { LibraryElement, VideoMedia } from '../types';
import styled from '@emotion/styled';
import { DragAndDropWrapper } from './drag-and-drop-wrapper';

type VideoLibraryElementProps = {
  media: VideoMedia & LibraryElement;
};
export const VideoLibraryElement: React.FC<VideoLibraryElementProps> = ({ media }) => {
  return (
    <DragAndDropWrapper media={media}>
      <VideoLibraryElementContainer>
        <div>{media.id}</div>
        <div>{media.type}</div>
        <div>{media.duration}</div>
      </VideoLibraryElementContainer>
    </DragAndDropWrapper>
  );
};

const VideoLibraryElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100px;
  background-color: pink;
`;
