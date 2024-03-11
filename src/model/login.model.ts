import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginModel {
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @MinLength(11, { message: 'O CPF deve ter pelo menos 11 caracteres.' })
  cpf: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  password: string;
}
