export interface User {
  id: string;
  cpf: string;
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
