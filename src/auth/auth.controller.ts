import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserSignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ValidateRecoveryCodeDto } from './dto/validate-recovery-code.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const { cpf, password } = loginData;
    const user = await this.authService.validateUser(cpf, password);
    if (user) {
      return this.authService.login(user);
    }
  }

  @Post('signUp')
  async signUp(@Body(new ValidationPipe()) userRegister: UserSignUpDto) {
    const user = await this.authService.signUp(userRegister);
    return user;
  }

  @Get('getAllUsers')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return await this.authService.forgotPassword(data.email);
  }

  @Post('validateRecoveryCode')
  async validateRecoveryCode(@Body() data: ValidateRecoveryCodeDto) {
    return await this.authService.validateRecoveryCode(data.email, data.code);
  }

  @Post('updatePassword')
  async updatePassword(@Body(new ValidationPipe()) data: UpdatePasswordDto) {
    const { token, email, newPassword } = data;
    return await this.authService.updatePassword(token, email, newPassword);
  }
}
