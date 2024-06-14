import React, { useMemo } from 'react';
import styled from '@emotion/styled';

import { VideoLibraryElement } from './video';
import { ImageLibraryElement } from './image';
import { createLibraryMediaItems } from '../utils/dataManipulation';
import { demoLibraryMediaItems } from '../mock';

export const MediaLibrary = () => {
  const libraryMediaItems = useMemo(() => createLibraryMediaItems(demoLibraryMediaItems), [demoLibraryMediaItems]);
  return (
    <MediaLibraryContainer>
      {libraryMediaItems.map((media) => {
        if (media.type === 'VIDEO') return <VideoLibraryElement key={media.id} media={media} />;
        if (media.type === 'IMAGE') return <ImageLibraryElement key={media.id} media={media} />;
        return <div>UNKNOWN_MEDIA_ELEMENT</div>;
      })}
    </MediaLibraryContainer>
  );
};

const MediaLibraryContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid red;
  width: 100%;
  height: 200px;
`;
