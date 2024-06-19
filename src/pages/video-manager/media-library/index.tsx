import React from 'react';
import styled from '@emotion/styled';

import { VideoLibraryElement } from './video';
import { useGate, useUnit } from 'effector-react';
import { $libraryElementsWithContainer, MediaLibraryGate } from '../model/model.effector';

export const MediaLibrary = () => {
  useGate(MediaLibraryGate);
  const libraryElementsWithContainer = useUnit($libraryElementsWithContainer);
  return (
    <MediaLibraryContainer>
      {libraryElementsWithContainer.map((media) => {
        if (media.type === 'video') return <VideoLibraryElement key={media.id} media={media} />;
        return <div key={media.id}>UNKNOWN_MEDIA_ELEMENT</div>;
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
