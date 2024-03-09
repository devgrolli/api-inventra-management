import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../auth/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebase: FirebaseService,
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    const usersRef = this.firebase.db.collection('User');
    const snapshot = await usersRef.where('userName', '==', userName).get();

    if (snapshot.empty) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    const doc = snapshot.docs[0];
    const user = doc.data();

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Senha inválida', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isValidated) {
      throw new HttpException(
        'Aguarde a aprovação do administrador para entrar',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async login(user: User) {
    const payload = { username: user.userName, sub: user.id };
    return {
      statusCode: HttpStatus.OK,
      message: 'Login realizado com sucesso',
      body: {
        username: user.userName,
        fullName: user.fullName,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    userName: string,
    fullName: string,
    email: string,
    password: string,
  ): Promise<any> {
    const userSnapshot = await this.firebase.db
      .collection('User')
      .where('userName', '==', userName)
      .get();
    if (!userSnapshot.empty) {
      throw new HttpException(
        `Usuário ${userName} já existe, tente outro nome de usuário.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailSnapshot = await this.firebase.db
      .collection('User')
      .where('email', '==', email)
      .get();
    if (!emailSnapshot.empty) {
      throw new HttpException(
        `Email ${email} já está em uso, tente outro email.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const id = uuidv4();
    const userRef = this.firebase.db.collection('User').doc(id);

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = {
      id,
      userName,
      fullName,
      email,
      password: hashedPassword,
      isValidated: false,
    };

    await userRef.set(user);

    return {
      statusCode: HttpStatus.OK,
      message:
        'Cadastrado com sucesso, espere o administrador fazer a confirmação.',
      body: {
        userName,
        fullName,
        email,
      },
    };
  }
}
