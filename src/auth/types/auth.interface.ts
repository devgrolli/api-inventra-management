import { HttpStatus } from '@nestjs/common';

export interface User {
  id: string;
  cpf: string;
  fullName: string;
  userName: string;
  password: string;
  isValidated: boolean;
}

export interface ValidationResponse {
  statusCode: HttpStatus;
  message: string;
}

export interface SignUpResponse {
  statusCode: HttpStatus;
  message: string;
  body: {
    cpf: string;
    fullName: string;
    email: string;
  };
}

export interface ForgotPasswordResponse {
  email: string;
  expiryTime: number;
  statusCode: HttpStatus;
  message: string;
}
