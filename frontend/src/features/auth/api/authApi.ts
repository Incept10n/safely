import api from '@/shared/api';

import { type LoginApiResponse } from './types';

export const createAuthApi = () => {
  const login = async (login: string, password: string) => {
    const response = await api.post<LoginApiResponse>('/api/login', {
      login,
      password,
    });

    return response.data;
  };

  const register = async (login: string, password: string) => {
    try {
      await api.post('/api/register', { login, password });

      return true;
    } catch {
      return false;
    }
  };

  return { login, register };
};
