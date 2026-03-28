import { Auth } from './features/auth';
import { Chat } from './features/chat';

export const App = () => {
  return (
    <div>
      <Auth ComponentOnAuth={Chat} />
    </div>
  );
};
