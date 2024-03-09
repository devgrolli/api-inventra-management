import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UserRegisterModel {
  id: string;

  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  @MinLength(4, {
    message: 'O nome do usuário deve ter pelo menos 4 caracteres.',
  })
  @MaxLength(20, {
    message: 'O nome do usuário deve ter no máximo 20 caracteres.',
  })
  userName: string;

  @IsNotEmpty({ message: 'Nome completo é obrigatorio.' })
  fullName: string;

  @IsNotEmpty({ message: 'O E-mail é obrigatório.' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha é muito fraca.',
  })
  password: string;
}
