import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from '../router/index';
import './init';
import { CheckAuth } from '@/shared/ui/check-auth';
import { useAuthStore } from '@/auth/auth-store';

export const App = () => {
  const auth = useAuthStore();
  return (
    <CheckAuth>
      <BrowserRouter>
        <Router isAuthenticated={auth.isAuthenticated} />
      </BrowserRouter>
    </CheckAuth>
  );
};
