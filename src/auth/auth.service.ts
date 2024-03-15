import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../auth/auth.interface';
import { UserSignUpModel } from 'src/model/signup.model';
import * as nodemailer from 'nodemailer';
import { HtmlRecoveryPassword } from './auth.password';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebase: FirebaseService,
  ) {}

  async validateInCollection(data: string, type: string): Promise<any> {
    const snapshot = await this.firebase.db
      .collection('User')
      .where(type, '==', data)
      .get();

    return snapshot;
  }

  async validateUser(cpf: string, password: string): Promise<any> {
    const snapshot = await this.validateInCollection(cpf, 'cpf');

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

  async signUp(data: UserSignUpModel): Promise<any> {
    const { fullName, cpf, email, password } = data;

    const cpfSnapshot = await this.validateInCollection(cpf, 'cpf');

    if (!cpfSnapshot.empty) {
      throw new HttpException(`Esse CPF já existe.`, HttpStatus.BAD_REQUEST);
    }

    const emailSnapshot = await this.validateInCollection(email, 'email');
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
      ...data,
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

  async forgotPassword(email: string): Promise<any> {
    const { GMAIL_USER, GMAIL_PASSWORD } = process.env;
    const snapshot = await this.validateInCollection(email, 'email');

    if (snapshot.empty) {
      throw new HttpException(`E-mail não encontrado.`, HttpStatus.BAD_REQUEST);
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const timestampCodeExpiresIn = Date.now() + 3600000;

    await this.firebase.db
      .collection('ResetPassword')
      .doc(email)
      .set({ code, timestampCodeExpiresIn }, { merge: true });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD,
      },
    });

    const html = HtmlRecoveryPassword(code);

    const mailOptions = {
      from: GMAIL_PASSWORD,
      to: email,
      subject: 'Recuperação de senha',
      text: `Você solicitou a recuperação de senha. Aqui está o seu código de recuperação: ${code}`,
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return {
        email,
        statusCode: HttpStatus.OK,
        message: 'O código de recuperação foi enviado para o e-mail inserido.',
      };
    } catch (error: any) {
      throw new HttpException(
        'Ocorreu um erro ao enviar o e-mail. Tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateRecoveryPassword(email: string, code: string): Promise<any> {
    const docRef = this.firebase.db.collection('ResetPassword').doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new HttpException(
        `Não há solicitação de recuperação de senha para este e-mail.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = doc.data();

    if (data.code !== code) {
      throw new HttpException(
        `Código de recuperação inválido.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.timestampCodeExpiresIn < Date.now()) {
      throw new HttpException(
        `Código de recuperação expirou.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Código de recuperação validado com sucesso.',
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
