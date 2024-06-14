import { FileManager } from '@/features/file-manager';
import { UploadManager } from '@/features/upload-manager';
import { CollapsibleTable } from '@/table/collapsible';

import { DefaultLayout } from '@/layouts/default';
import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { useJobResultStore } from './model';

export const JobResultPage = () => {
  const jobResultStore = useJobResultStore();
  useEffect(() => {
    jobResultStore.getResultList();
  }, []);
  return (
    <DefaultLayout>
      <JobResultPageContainer>
        {jobResultStore.resultList.map(({ id, type, result }) => {
          return (
            <div key={id}>
              <div>from: {type}</div>
              <video width={200} src={`http://127.0.0.1:4001/${result}`}></video>
            </div>
          );
        })}
      </JobResultPageContainer>
    </DefaultLayout>
  );
};

const JobResultPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  width: 100%;
  height: 100%;
`;
