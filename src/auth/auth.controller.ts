import {
  Controller,
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
    const { userName, password } = loginData;
    const user = await this.authService.validateUser(userName, password);
    if (user) {
      return this.authService.login(user);
    }
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) userRegister: UserRegisterModel) {
    const { userName, fullName, email, password } = userRegister;
    const user = await this.authService.register(
      userName,
      fullName,
      email,
      password,
    );
    return user;
  }
}
