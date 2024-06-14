import { httpClient } from '@/shared/api';
import { RegisteredFile } from '@/shared/types';
import { create } from 'zustand';

type FileManagerState = {
  errors: string[] | null;
  isLoading: boolean;
  registeredFiles: RegisteredFile[];
};

type FileManagerActions = {
  updateRegisteredFiles: (payload: RegisteredFile[]) => void;
  removeAllFiles: () => void;
  joinSelectedFiles: () => void;
  startToMergeVideoFiles: (uploadId: number) => Promise<void>;
  reset: () => void;
};

const initState: FileManagerState = {
  registeredFiles: [],
  errors: null,
  isLoading: false,
};
export const useFileManagerStore = create<FileManagerState & FileManagerActions>((set, get) => ({
  ...initState,
  updateRegisteredFiles: (payload) => set({ registeredFiles: payload }),
  startToMergeVideoFiles: async (uploadId: number) => {
    try {
      set({ isLoading: true });
      await httpClient.fileManager.startToMergeVideoFiles(uploadId);
    } catch (e) {
      set({ errors: ['error'] });
    } finally {
      set({ isLoading: false });
    }
  },
  removeAllFiles: async () => {
    await httpClient.fileManager.removeAllFiles();
  },
  joinSelectedFiles: async () => {
    await httpClient.fileManager.joinFiles([1, 2]);
  },
  reset: () => set(initState),
}));
