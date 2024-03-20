import { IsNotEmpty, MinLength } from 'class-validator';
import { StrongPassword } from 'src/decorators/password.decorator';

export class UpdatePasswordDto {
  token: string;
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @StrongPassword({ message: 'A senha é muito fraca.' })
  newPassword: string;
}
