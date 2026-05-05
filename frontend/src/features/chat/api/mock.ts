import type { Message, Person } from '../store/types';

const getUsers = (): Promise<Person[]> =>
  Promise.resolve([
    {
      uid: '1',
      name: 'Lilly',
      profilePicture:
        'https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg',
      active: false,
      chatId: 1,
    },
    {
      uid: '2',
      name: 'Joe',
      profilePicture:
        'https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg',
      active: false,
      chatId: 2,
    },
    {
      uid: '3',
      name: 'Emily',
      profilePicture:
        'https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg',
      active: false,
      chatId: 3,
    },
    {
      uid: '4',
      name: 'Kai',
      profilePicture:
        'https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg',
      active: false,
      chatId: 4,
    },
    {
      uid: '5',
      name: 'Akane',
      profilePicture:
        'https://chatscope.io/storybook/react/assets/akane-MXhWvx63.svg',
      active: false,
      chatId: 5,
    },
    {
      uid: '6',
      name: 'Eliot',
      profilePicture:
        'https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg',
      active: false,
      chatId: 6,
    },
    {
      uid: '7',
      name: 'Zoe',
      profilePicture:
        'https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg',
      active: true,
      chatId: 7,
    },
    {
      uid: '8',
      name: 'Patrik',
      profilePicture:
        'https://chatscope.io/storybook/react/assets/patrik-yC7svbAR.svg',
      active: false,
      chatId: 8,
    },
  ]);

const getMessages = (): Promise<Message[]> =>
  Promise.resolve([
    {
      direction: 'incoming',
      message: 'Hello my friend',
    },
    {
      direction: 'outgoing',
      message: 'Hello my friend',
    },
    {
      direction: 'incoming',
      message: 'Hello my friend',
    },
    {
      direction: 'incoming',
      message: 'Hello my friend',
    },
    {
      direction: 'incoming',
      message: 'Hello my friend',
    },
    {
      direction: 'incoming',
      message: 'Hello my friend',
    },
    {
      direction: 'outgoing',
      message: 'Hello my friend',
    },
    {
      direction: 'outgoing',
      message: 'Hello my friend',
    },
    {
      direction: 'outgoing',
      message: 'Hello my friend',
    },
    {
      direction: 'outgoing',
      message: 'Hello my friend',
    },
    {
      direction: 'incoming',
      message: 'Hello my friend',
    },
    {
      direction: 'incoming',
      message: 'Hello my friend',
    },
  ]);

export const chatMocks = {
  getUsers,
  getMessages,
};
