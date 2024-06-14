import { httpClient } from '@/shared/api';
import { RegisteredFile } from '@/shared/types';

import { create } from 'zustand';

type JobMergeResult = {
  id: number;
  type: string;
  result: string;
};
type JobResult = JobMergeResult;
type JobResultState = {
  errors: string[] | null;
  isLoading: boolean;
  resultList: JobResult[];
};

type JobResultActions = {
  getResultList: () => void;
  reset: () => void;
};

const initState: JobResultState = {
  resultList: [],
  errors: null,
  isLoading: false,
};
export const useJobResultStore = create<JobResultState & JobResultActions>((set, get) => ({
  ...initState,
  getResultList: async () => {
    try {
      set({ isLoading: true });
      const resultListResponse = await httpClient.job.getResultList();
      set({ resultList: resultListResponse.data.resultList });
    } catch (e) {
      console.log(e);
      set({ errors: ['error'] });
    } finally {
      set({ isLoading: false });
    }
  },
  reset: () => set(initState),
}));
