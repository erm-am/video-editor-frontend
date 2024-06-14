import { useAuthStore } from '@/auth/auth-store';
import { useEffect } from 'react';

export const LogoutPage = () => {
  const auth = useAuthStore();
  useEffect(() => {
    auth.logout();
  });
  return null;
};
