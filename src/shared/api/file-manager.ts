import { AxiosProgressEvent } from 'axios';
import { v4 } from 'uuid';
import { axiosInstance as api } from './axios';

type OnUploadProgress = (percent: number) => void;
type UploadFilesResponse = {
  id: string;
};

export const uploadFiles = (files: File[], onUploadProgress?: OnUploadProgress): Promise<UploadFilesResponse> => {
  let formData = new FormData();
  files.forEach((file) => formData.append(`file`, file));
  return new Promise((resolve, reject) => {
    return api
      .post<UploadFilesResponse>(`api/v1/file-manager/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onUploadProgress) onUploadProgress(Math.floor(progressEvent.progress * 100));
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const startToMergeVideoFiles = (uploadId: number) => api.post(`api/v1/file-manager/merge-video-files`, { uploadId });
export const removeAllFiles = () => api.post(`api/v1/file-manager/remove-all-files`);
export const joinFiles = (ids: number[]) => api.post(`api/v1/file-manager/join-files`, { ids });
