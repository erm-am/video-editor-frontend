import { axiosInstance as api } from './axios';

type ResultListResponse = any;
export const getResultList = () => {
  return api.get<ResultListResponse>(`api/v1/job/result-list`);
};
