import React from 'react';
import styled from '@emotion/styled';

import { useGate, useUnit } from 'effector-react';
import { $libraryElements, LibraryGate } from '../model/model';
import { VideoElement } from './video-element';
export const Library = () => {
  useGate(LibraryGate);
  const libraryElements = useUnit($libraryElements);
  return (
    <LibraryContainer>
      {libraryElements.map((media) => {
        if (media.type === 'video') return <VideoElement key={media.id} media={media} />;
        // if (media.type === 'audio') return <AudioElement key={media.id} media={media} />;
        return <div key={media.id}>UNKNOWN_MEDIA_ELEMENT</div>;
      })}
    </LibraryContainer>
  );
};

const LibraryContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid red;
  width: 100%;
  height: 200px;
`;
