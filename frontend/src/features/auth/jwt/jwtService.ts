import { jwtDecode } from 'jwt-decode';

export type JwtUser = {
  id: number;
  name: string;
};

export type TokenPayload = JwtUser & {
  exp?: number;
  iat?: number;
};

const STORAGE_KEYS = {
  TOKEN: 'jwt_token',
  USER: 'user',
} as const;

const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

const getUserFromStorage = (): JwtUser | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};

const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const auth = {
  login(token: string, user: JwtUser): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  logout(): void {
    clearAuthData();
  },

  isAuthenticated(): boolean {
    const token = getToken();

    if (!token) {
      return false;
    }

    const payload = decodeToken(token);

    if (!payload) {
      clearAuthData();
      return false;
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearAuthData();
      return false;
    }

    return true;
  },

  getUser(): JwtUser | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    return getUserFromStorage();
  },

  getAuthHeader(): { Authorization: string } | undefined {
    const token = getToken();

    if (token && this.isAuthenticated()) {
      return { Authorization: `Bearer ${token}` };
    }

    return undefined;
  },
};
