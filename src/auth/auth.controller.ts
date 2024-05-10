import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Controller,
  ValidationPipe,
} from '@nestjs/common';
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
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: LoginDto) {
    const { cpf, password } = loginData;
    const user = await this.authService.validateUser(cpf, password);
    if (user) {
      return this.authService.login(user);
    }
  }

  @Post('signUp')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body(new ValidationPipe()) userRegister: UserSignUpDto) {
    const user = await this.authService.signUp(userRegister);
    return user;
  }
  @Get('getAllUsers')
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query('lastDocId') lastDocId?: string) {
    return await this.authService.getAllUsers(lastDocId);
  }

  @Post('forgotPassword')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return await this.authService.forgotPassword(data.email);
  }

  @Post('validateRecoveryCode')
  @HttpCode(HttpStatus.OK)
  async validateRecoveryCode(@Body() data: ValidateRecoveryCodeDto) {
    return await this.authService.validateRecoveryCode(data.email, data.code);
  }

  @Post('updatePassword')
  @HttpCode(HttpStatus.OK)
  async updatePassword(@Body(new ValidationPipe()) data: UpdatePasswordDto) {
    const { token, email, newPassword } = data;
    return await this.authService.updatePassword(token, email, newPassword);
  }

  @Patch(':cpf/disableNotify')
  @HttpCode(HttpStatus.OK)
  async updateDisableNotify(
    @Param('cpf') cpf: string,
    @Body('disableNotify') disableNotify: boolean,
  ) {
    return await this.authService.updateDisableNotify(cpf, disableNotify);
  }

  @Patch(':cpf/disableAccessUser')
  @HttpCode(HttpStatus.OK)
  async updateDisableAccessUser(
    @Param('cpf') cpf: string,
    @Body('isValidated') isValidated: boolean,
  ) {
    return await this.authService.updateDisableAccessUser(cpf, isValidated);
  }

  @Post('validateToken')
  async validateToken(@Body('token') token: string) {
    const isValid = await this.authService.validateToken(token);
    return { valid: isValid };
  }
}
