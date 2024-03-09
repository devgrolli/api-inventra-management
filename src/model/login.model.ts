import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginModel {
  @IsNotEmpty({ message: 'O nome do usuário é obrigatório.' })
  userName: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  password: string;
}
