export interface LoginApiParams {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}