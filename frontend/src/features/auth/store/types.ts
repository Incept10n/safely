import type { Nonce, Nullable, UserId } from '@/shared/types';

export type AuthUser = {
  nonce: Nonce;
  userId: UserId;
  name: string;
  logoUrl: string;
};

export type AuthState = {
  user: Nullable<AuthUser>;
};

export type AuthActions = {
  setUser: (user: AuthUser) => void;
};
