import axios from 'axios';
import { type LoginApiResponse } from './types';

export const createAuthApi = () => {
  const login = async (login: string, password: string) => {
    const response = await axios.get<LoginApiResponse>('/api/login', {
      login,
      password,
    });
  };

  const register = async (login: string, password: string) => {
    try {
      await axios.post('/api/register', { login, password });

      return true;
    } catch {
      return false;
    }
  };

  return { login, register };
};
