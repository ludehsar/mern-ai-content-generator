export interface User {
  _id: string;
  username: string;
  name: string;
}

export interface RegisterDto {
  name: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ErrorResponse {
  message: string;
}
