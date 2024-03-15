import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  // UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpModel } from '../model/signup.model';
import { LoginModel } from '../model/login.model';
// import { AuthenticatedGuard } from './auth.guards';

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

  @Post('signUp')
  async signUp(@Body(new ValidationPipe()) userRegister: UserSignUpModel) {
    const user = await this.authService.signUp(userRegister);
    return user;
  }

  @Get('getAllUsers')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() data: { email: string }) {
    console.log('data', data.email);
    return await this.authService.forgotPassword(data.email);
  }
}
