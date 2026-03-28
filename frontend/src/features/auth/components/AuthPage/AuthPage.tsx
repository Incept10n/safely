import { useState } from 'react';
import styles from './AuthPage.module.scss';
import { useAuth } from '../../store/store';
import { auth } from '../../jwt';
import { authStoreMapper } from '../../store';
import { createAuthApi } from '../../api';

const api = createAuthApi();

export const AuthPage = () => {
  const authState = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!loginValue || !password) {
      setError('Fill all fields');
      return;
    }

    if (isLogin) {
      try {
        const res = await api.login(loginValue, password);

        auth.login(res.token, res.user);

        authState.setUser(
          authStoreMapper.jwtUserToAuthUser({
            id: res.user.id,
            name: res.user.name,
          } as any),
        );
      } catch {
        setError('Invalid credentials');
      }
    } else {
      const success = await api.register(loginValue, password);

      if (!success) {
        setError('Registration failed');
        return;
      }

      setIsLogin(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        <input
          type="text"
          placeholder="Login"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={handleSubmit}>{isLogin ? 'Login' : 'Register'}</button>

        <div className={styles.switch}>
          {isLogin ? 'No account?' : 'Already have an account?'}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Register' : ' Login'}
          </span>
        </div>
      </div>
    </div>
  );
};
