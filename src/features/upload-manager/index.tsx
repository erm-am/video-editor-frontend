import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from '@emotion/styled';
import { httpClient } from '@/shared/api';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { Button } from '@/shared/ui/button';

export const UploadManager = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const onDrop = (acceptedFiles: File[]) => setAcceptedFiles(acceptedFiles);
  const upload = () => {
    httpClient.fileManager.uploadFiles(acceptedFiles, (percent) => setProgress(percent)).catch(() => setProgress(0));
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <UploadManagerContainer>
      <FileListContainer>
        <FileList>
          {acceptedFiles.map((file) => {
            return <File key={file.name}>{file.name}</File>;
          })}
        </FileList>
        <ProgressBar progress={progress} />
        <Button onClick={upload}>Upload</Button>
      </FileListContainer>
      <UploaderContainer {...getRootProps()}>
        <UploaderInput {...getInputProps()} />
        <Message>Click to upload or drag and drop</Message>
      </UploaderContainer>
    </UploadManagerContainer>
  );
};

const UploadManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px;
  width: 100%;
  border: 1px solid orange;
`;
const FileListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const UploaderContainer = styled.div`
  display: flex;
  height: 300px;
  background-color: gray;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
`;
const UploaderInput = styled.input``;
const Message = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const FileList = styled.div`
  display: flex;
  flex-direction: column;
`;
const File = styled.div`
  display: flex;
`;
