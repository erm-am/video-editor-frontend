import React from 'react';
import styled from '@emotion/styled';
import { DndLibraryWrapper } from './dnd-library-wrapper';
import { VideoLibraryMediaElement } from '../model/types';

type VideoLibraryElementProps = {
  media: VideoLibraryMediaElement;
};
export const VideoLibraryElement: React.FC<VideoLibraryElementProps> = ({ media }) => {
  return (
    <DndLibraryWrapper media={media}>
      <VideoLibraryElementContainer>
        <Description>{media.id}</Description>
        <Description>{media.type}</Description>
        <Description>{media.duration}</Description>
      </VideoLibraryElementContainer>
    </DndLibraryWrapper>
  );
};

const VideoLibraryElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100px;
  background-color: pink;
`;
const Description = styled.div`
  color: gray;
`;
