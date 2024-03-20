import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateRecoveryCodeDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Insira o código enviado no seu e-mail.' })
  code: string;
}
