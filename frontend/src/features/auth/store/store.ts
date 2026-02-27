import { create } from 'zustand';
import type { AuthActions, AuthState, AuthUser } from './types';

export const useAuth = create<AuthState & AuthActions>((set) => ({
  user: null,
  setUser: (user: AuthUser) => set(() => ({ user })),
}));
