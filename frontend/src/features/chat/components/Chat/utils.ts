import type { Person } from '../../store/types';

export const getActiveUser = (contacts: Person[]) =>
  contacts.find((user) => user.active);
