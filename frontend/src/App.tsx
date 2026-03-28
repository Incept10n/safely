import { Auth } from './features/auth';
import { Chat } from './features/chat';

import './index.scss';

export const App = () => {
  return (
    <div>
      <Auth ComponentOnAuth={Chat} />
    </div>
  );
};
