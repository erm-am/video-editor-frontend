import { useAuthStore } from '@/auth/auth-store';
import { Paths } from '@/router/paths';
import { Button } from '@/shared/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const login = (login, password) => {
    auth.login(login, password).then(() => {
      navigate(Paths.MAIN);
    });
  };

  return (
    <div>
      <Button onClick={() => login('admin', 'qwerty')}>login</Button>
    </div>
  );
};
