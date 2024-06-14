import { httpClient } from '@/shared/api';
import { sleep } from '@/shared/utils/sleep';
import { create } from 'zustand';

type Profile = {
  id: string;
  name: string;
};
type AuthState = {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthActions = {
  login: (login: string, password: string) => Promise<void>;
  check: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  check: async () => {
    try {
      set({ isLoading: true });
      await sleep(1000);
      await httpClient.auth.checkAuth();
      set({ isAuthenticated: true });
    } catch (e) {
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (login: string, password: string) => {
    try {
      set({ isLoading: true });
      await sleep(1000);
      const response = await httpClient.auth.login(login, password);
      set({ isAuthenticated: true, profile: response.data });
    } catch (e) {
      console.log(e);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await sleep(1000);
      await httpClient.auth.logout();
      set({ isAuthenticated: false });
    } finally {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));
