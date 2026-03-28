export type LoginApiResponse = {
  status: 'ok';
  token: string;
  user: LoginUser;
};

export type LoginUser = {
  id: number;
  name: string;
};
