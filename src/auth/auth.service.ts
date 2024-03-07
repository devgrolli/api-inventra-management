import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { User } from "../auth/auth.interface";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebase: FirebaseService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const userRef = this.firebase.db.collection('User').doc(username);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    const user = doc.data();
    if (!user || !user.password) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Senha inválida', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async login(user: User) {
    const payload = { username: user.userName, sub: user.userName };
    return {
      statusCode: HttpStatus.OK,
      message: 'Login realizado com sucesso',
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    username: string,
    password: string,
    email: string,
  ): Promise<any> {
    const userRef = this.firebase.db.collection('User').doc(username);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      userName: username,
      email: email,
      password: hashedPassword,
    };

    await userRef.set(user);

    return user;
  }
}
