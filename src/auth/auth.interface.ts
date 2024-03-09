export interface User {
  id: string;
  fullName: string;
  userName: string;
  password: string;
  isValidated: boolean;
}

export interface UserRegister {
  fullName: string;
  userName: string;
  password: string;
  email: string;
}
