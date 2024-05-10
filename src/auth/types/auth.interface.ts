import { HttpStatus } from '@nestjs/common';

export interface User {
  id: string;
  cpf: string;
  fullName: string;
  userName: string;
  password: string;
  disableNotify: boolean;
  isValidated: boolean;
}

export interface ApiResponse {
  statusCode: HttpStatus;
  message: string;
}

export interface SignUpBody {
  cpf: string;
  fullName: string;
  email: string;
}

export interface ValidationResponse extends ApiResponse {}

export interface SignUpResponse extends ApiResponse {
  body: SignUpBody;
}

export interface ForgotPasswordResponse extends ApiResponse {
  email: string;
  expiryTime: number;
}
