import React from 'react';
import { useEffect } from 'react';
import { Loader } from '../loader';
import { useAuthStore } from '@/auth/auth-store';

export const CheckAuth = ({ children }) => {
  const auth = useAuthStore();
  useEffect(() => {
    auth.check();
  }, []);
  return auth.isLoading ? <Loader /> : children;
};
