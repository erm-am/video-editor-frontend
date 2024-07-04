import React from 'react';
import styled from '@emotion/styled';

import { LibraryElement } from '../model/types';
import { DragAndDropWrapper } from './drag-and-drop-wrapper';

type VideoElementProps = {
  media: LibraryElement;
};
export const VideoElement: React.FC<VideoElementProps> = ({ media }) => {
  return (
    <DragAndDropWrapper media={media}>
      <VideoElementContainer>
        <Description>{media.type}</Description>
        <Description>{media.duration}</Description>
      </VideoElementContainer>
    </DragAndDropWrapper>
  );
};

const VideoElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100px;
  background-color: pink;
`;
const Description = styled.div`
  color: gray;
`;
