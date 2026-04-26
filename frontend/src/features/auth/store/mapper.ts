import { randomPersonURL } from '@/shared/constants';
import type { JwtUser } from '../jwt/jwtService';
import type { AuthUser } from './types';

const jwtUserToAuthUser = (jwtUser: JwtUser): AuthUser => ({
  logoUrl: randomPersonURL,
  name: jwtUser.name,
  userId: jwtUser.id.toString(),
  nonce: '',
});

export const authStoreMapper = { jwtUserToAuthUser };
