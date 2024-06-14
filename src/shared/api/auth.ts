import { AxiosProgressEvent } from 'axios';
import { axiosInstance as api } from './axios';

type LoginResponse = {
  id: string;
  name: string;
};
export const login = (login: string, password: string) => {
  return api.post<LoginResponse>(`api/v1/auth/login`, {
    login,
    password,
  });
};
export const checkAuth = () => {
  return api.post(`api/v1/auth/check-auth`);
};

export const logout = () => {
  return api.post(`api/v1/auth/logout`);
};
