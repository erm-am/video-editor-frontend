import styled from '@emotion/styled';
import React from 'react';
import { DefaultLayout } from '@/layouts/default';
import { Timeline } from './timeline';
import { Library } from './library';
import './model/index';
export const VideoManagerPage = () => {
  return (
    <DefaultLayout>
      <VideoManager>
        <Library />
        <Timeline />
      </VideoManager>
    </DefaultLayout>
  );
};

const VideoManager = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  width: 100%;
  height: 100%;
`;
