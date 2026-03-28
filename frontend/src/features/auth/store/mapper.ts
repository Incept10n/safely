import type { JwtUser } from '../jwt/jwtService';
import type { AuthUser } from './types';

const jwtUserToAuthUser = (jwtUser: JwtUser): AuthUser => ({
  logoUrl: '',
  name: jwtUser.name,
  userId: jwtUser.id.toString(),
  nonce: '',
});

export const authStoreMapper = { jwtUserToAuthUser };
