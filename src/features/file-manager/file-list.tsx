import { RegisteredFile } from '@/shared/types';
import { Button } from '@/shared/ui/button';
import styled from '@emotion/styled';
import React from 'react';

type FileListProps = {
  files: RegisteredFile[];
};

export const FileList: React.FC<FileListProps> = (props) => {
  const { files } = props;
  return (
    <FileListContainer>
      <>
        {files.map((file) => {
          const { videoDuration, name, tasks, id, imagePath } = file;
          const { hours, minutes, seconds, milliseconds } = videoDuration;
          return (
            <Preview key={id}>
              {tasks.frameExtract.isCompleted && <Image src={`http://127.0.0.1:4001/${imagePath}`} />}
              <Name>{name}</Name>
              {tasks.parse.inProgress && <Time>loading</Time>}
              {tasks.parse.isCompleted && <Time>{`${hours}:${minutes}:${seconds}:${milliseconds}`}</Time>}
              <Actions>
                <Info>I</Info>
                <Add>A</Add>
                <Remove>R </Remove>
              </Actions>
            </Preview>
          );
        })}
      </>
    </FileListContainer>
  );
};

const Actions = styled.div`
  display: none;
  width: 100%;
  height: 100%;
  height: auto;
  position: absolute;
  bottom: 0px;
  justify-content: space-between;
`;
const Time = styled.div`
  position: absolute;
  bottom: 4px;
  left: 4px;
  font-size: 13px;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  text-align: left;
  border-radius: 4px;
  background-color: rgba(10, 11, 13, 0.62);
  color: #fafafa;
  padding: 4px 8px;
`;

const FileListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(25% - 10px));
  width: 100%;
  position: relative;
  cursor: pointer;
  flex-direction: column;
  gap: 10px;
  border-radius: 4px;
`;
const Preview = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 4px;

  &:hover ${Actions} {
    display: flex;
    border: 1px solid gray;
  }

  &:hover ${Time} {
    display: none;
  }
`;
const Remove = styled(Button)`
  width: 32px;
  height: 32px;
  background-color: #3e3e41;
`;
const Add = styled(Button)``;
const Info = styled(Button)``;

const Image = styled.img`
  width: 100%;
  object-fit: contain;
  border-radius: 4px;
`;
const Name = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
