import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRegister } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards()
  @Post('login')
  async login(@Body() { userName, password }: User) {
    const user = await this.authService.validateUser(userName, password);
    if (user) {
      return this.authService.login(user);
    }
  }

  @Post('register')
  async register(@Body() { userName, password, email }: UserRegister) {
    const user = await this.authService.register(userName, password, email);
    return user;
  }
}
