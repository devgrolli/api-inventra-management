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

  async validateUser(cpf: string, password: string): Promise<any> {
    const usersRef = this.firebase.db.collection('User');
    const snapshot = await usersRef.where('cpf', '==', cpf).get();

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
    const payload = { cpf: user.cpf, sub: user.id };
    return {
      statusCode: HttpStatus.OK,
      message: 'Login realizado com sucesso',
      body: {
        cpf: user.cpf,
        username: user.userName,
        fullName: user.fullName,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    cpf: string,
    fullName: string,
    email: string,
    password: string,
  ): Promise<any> {
    const cpfSnapshot = await this.firebase.db
      .collection('User')
      .where('cpf', '==', cpf)
      .get();
    if (!cpfSnapshot.empty) {
      throw new HttpException(
        `O CPF ${cpf} já existe.`,
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
      cpf,
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
        cpf,
        fullName,
        email,
      },
    };
  }

  async getAllUsers(): Promise<any[]> {
    const snapshot = await this.firebase.db.collection('User').get();
    return snapshot.docs.map((doc) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = doc.data() as User;
      return userWithoutPassword;
    });
  }
}
