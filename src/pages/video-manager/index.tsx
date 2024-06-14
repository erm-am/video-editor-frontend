import styled from '@emotion/styled';
import React from 'react';

import { FileManager } from '@/features/file-manager';
import { UploadManager } from '@/features/upload-manager';
import { DefaultLayout } from '@/layouts/default';

import { MediaLibrary } from './media-library';
import { Timeline } from './timeline';

export const VideoManagerPage = () => {
  return (
    <DefaultLayout>
      <VideoManagerPageContainer>
        <FileManager />
        <UploadManager />
        <MediaLibrary />
        <Timeline />
      </VideoManagerPageContainer>
    </DefaultLayout>
  );
};

const VideoManagerPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  width: 100%;
  height: 100%;
`;
