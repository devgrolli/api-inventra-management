import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterModel } from '../model/register.model';
import { LoginModel } from '../model/login.model';
import { AuthenticatedGuard } from './auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards()
  @Post('login')
  async login(@Body() loginData: LoginModel) {
    const { cpf, password } = loginData;
    const user = await this.authService.validateUser(cpf, password);
    if (user) {
      return this.authService.login(user);
    }
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) userRegister: UserRegisterModel) {
    const { cpf, fullName, email, password } = userRegister;
    const user = await this.authService.register(
      cpf,
      fullName,
      email,
      password,
    );
    return user;
  }

  @Get('getAllUsers')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
