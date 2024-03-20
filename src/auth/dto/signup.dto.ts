import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsDateFormatBR } from 'src/decorators/dateformat.decorator';
import { StrongPassword } from 'src/decorators/password.decorator';

export class UserSignUpDto {
  id: string;

  @IsNotEmpty({ message: 'Nome completo é obrigatorio.' })
  fullName: string;

  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  cpf: string;

  @IsNotEmpty({ message: 'A Data de nascimento é obrigatória.' })
  @IsDateFormatBR({
    message: 'Data inválida.',
  })
  birthDate: string;

  @IsNotEmpty({ message: 'O número de telefone é obrigatório.' })
  phone: string;

  @IsNotEmpty({ message: 'O E-mail é obrigatório.' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @StrongPassword({ message: 'A senha é muito fraca.' })
  password: string;
}
