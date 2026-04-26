import axios from 'axios';

import { auth } from '@/features/auth/jwt';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const authHeader = auth.getAuthHeader();

    if (authHeader) {
      config.headers.Authorization = authHeader.Authorization;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
