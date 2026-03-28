import type { ComponentType, FC } from 'react';
import { useAuth } from '../../store/store';
import { auth } from '../../jwt';
import type { UserId } from '@/shared/types';
import { authStoreMapper } from '../../store';
import type { JwtUser } from '../../jwt/jwtService';
import { AuthPage } from '../AuthPage/AuthPage';

type ChatLike = {
  currentUserId: UserId;
};

export type AuthProps = {
  ComponentOnAuth: ComponentType<ChatLike>;
};

export const Auth: FC<AuthProps> = ({ ComponentOnAuth }) => {
  const authState = useAuth();

  if (auth.isAuthenticated()) {
    authState.setUser(
      authStoreMapper.jwtUserToAuthUser(auth.getUser() as JwtUser),
    );
  }

  if (!authState.user && auth.getUser()) {
    authState.setUser(authStoreMapper.jwtUserToAuthUser(auth.getUser()!));
  }

  if (!authState.user) {
    return <AuthPage />;
  }

  return <ComponentOnAuth currentUserId={authState.user.userId} />;
};
