import type { ComponentType, FC } from 'react';
import { useAuth } from '../../store/store';
import { auth } from '../../jwt';
import type { UserId } from '@/shared/types';
import { authStoreMapper } from '../../store';
import { createAuthApi } from '../../api';

type ChatLike = {
  currentUserId: UserId;
};

export type AuthProps = {
  ComponentOnAuth: ComponentType<ChatLike>;
};

export const Auth: FC<AuthProps> = ({ ComponentOnAuth }) => {
  const authState = useAuth();
  const authApi = createAuthApi();

  if (!auth.isAuthenticated()) {
    // get user info and set user
  }

  if (!authState.user && auth.getUser()) {
    authState.setUser(authStoreMapper.jwtUserToAuthUser(auth.getUser()!));
  }

  if (!authState.user) {
    return <div>authorization page</div>;
  }

  return <ComponentOnAuth currentUserId={authState.user.userId} />;
};
