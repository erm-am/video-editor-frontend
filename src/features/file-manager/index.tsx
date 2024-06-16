import styled from '@emotion/styled';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useWebSocket } from '@/shared/ws/use-web-socket';
import { useFileManagerStore } from './model';
import { FileList } from './file-list';
import { Button } from '@/shared/ui/button';

export const FileManager: React.FC = () => {
  const fileManagerStore = useFileManagerStore();

  // useWebSocket('ws://127.0.0.1:4001/ws', (message) => {
  //   if (message.type === 'UPLOAD_LIST') {
  //     fileManagerStore.updateRegisteredFiles(message.payload);
  //   }
  // });

  return (
    <FileManagerContainer>
      <Actions>
        <Button
          onClick={() => {
            fileManagerStore.removeAllFiles();
          }}
        >
          Delete all
        </Button>
        <Button
          onClick={() => {
            fileManagerStore.joinSelectedFiles();
          }}
        >
          Join
        </Button>
      </Actions>
      <FileList files={fileManagerStore.registeredFiles} />
    </FileManagerContainer>
  );
};
const FileManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
`;
const Actions = styled.div`
  display: flex;
  border: 1px solid black;
`;
