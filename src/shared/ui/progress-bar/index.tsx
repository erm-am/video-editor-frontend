import React, { useCallback, useState } from 'react';

import styled from '@emotion/styled';

type ProgressBarProps = {
  progress: number;
};
export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <ProgressBarContainer>
      <Progress progress={progress} />
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.div`
  display: flex;
  height: 5px;
  overflow: hidden;
  background-color: #d7d7d7;
`;

const Progress = styled.div<Pick<ProgressBarProps, 'progress'>>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: #4bbd37;
  transition: width 0.3s ease-in-out;
`;
