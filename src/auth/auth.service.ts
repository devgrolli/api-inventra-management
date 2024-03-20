import { HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserSignUpDto } from 'src/auth/dto/signup.dto';
import { htmlRecoveryPassword } from '../mail/html/forgotPassword';
import { throwCustomException } from '../utils/exception.utils';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { MAIL, ERROR_MESSAGES, SUCCESS_MESSAGES } from './types/auth.constants';
import {
  timestampCodeExpires,
  generateCode,
} from '../utils/generate-code.utils';
import {
  ForgotPasswordResponse,
  ValidationResponse,
  SignUpResponse,
  User,
} from './types/auth.interface';

@Injectable()
export class AuthService {
  private readonly COLLECTION_USER = 'User';
  private readonly COLLECTION_RESET_PASSWORD = 'ResetPassword';

  constructor(
    private firebase: FirebaseService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async validateInCollection(
    fieldValue: string,
    fieldName: string,
  ): Promise<FirebaseFirestore.QuerySnapshot> {
    const userSnapshot = await this.firebase.db
      .collection(this.COLLECTION_USER)
      .where(fieldName, '==', fieldValue)
      .get();

    return userSnapshot;
  }

  async validateUser(cpf: string, password: string): Promise<User> {
    const userSnapshot = await this.validateInCollection(cpf, 'cpf');

    if (userSnapshot.empty) {
      throwCustomException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const doc = userSnapshot.docs[0];
    const user = doc.data();

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throwCustomException(
        ERROR_MESSAGES.INVALID_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.isValidated) {
      throwCustomException(
        ERROR_MESSAGES.AWAITING_ADMIN_APPROVAL,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user as User;
  }

  async login(user: User) {
    const payload = { cpf: user.cpf, sub: user.id };
    return {
      statusCode: HttpStatus.OK,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      body: {
        cpf: user.cpf,
        username: user.userName,
        fullName: user.fullName,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(data: UserSignUpDto): Promise<SignUpResponse> {
    const { fullName, cpf, email, password } = data;

    const cpfSnapshot = await this.validateInCollection(cpf, 'cpf');

    if (!cpfSnapshot.empty) {
      throwCustomException(ERROR_MESSAGES.CPF_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const emailSnapshot = await this.validateInCollection(email, 'email');
    if (!emailSnapshot.empty) {
      throwCustomException(
        ERROR_MESSAGES.EMAIL_IN_USE(email),
        HttpStatus.BAD_REQUEST,
      );
    }

    const id = uuidv4();
    const newUserRef = this.firebase.db
      .collection(this.COLLECTION_USER)
      .doc(id);

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = {
      ...data,
      password: hashedPassword,
      isValidated: false,
    };

    await newUserRef.set(user);

    return {
      statusCode: HttpStatus.OK,
      message: SUCCESS_MESSAGES.USER_REGISTERED,
      body: {
        cpf,
        fullName,
        email,
      },
    };
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const emailSnapshot = await this.validateInCollection(email, 'email');

    if (emailSnapshot.empty) {
      throwCustomException(
        ERROR_MESSAGES.EMAIL_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const fullName = emailSnapshot.docs[0]?.data()?.fullName;

    const code = generateCode();
    const expiryTime = timestampCodeExpires();

    await this.firebase.db
      .collection(this.COLLECTION_RESET_PASSWORD)
      .doc(email)
      .set({ code, expiryTime }, { merge: true });

    const transporter = this.mailService.createTransporter();
    const html = htmlRecoveryPassword(code, fullName);

    const mailOptions = {
      from: this.configService.get('GMAIL_USER'),
      to: email,
      subject: MAIL.SUBJECT,
      text: MAIL.TEXT_MAIL(code),
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return {
        email,
        expiryTime,
        statusCode: HttpStatus.OK,
        message: SUCCESS_MESSAGES.CODE_SENT_EMAIL,
      };
    } catch (error: any) {
      throwCustomException(
        ERROR_MESSAGES.EMAIL_SEND_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateRecoveryPassword(
    email: string,
    code: string,
  ): Promise<ValidationResponse> {
    const resetPasswordDocRef = this.firebase.db
      .collection(this.COLLECTION_RESET_PASSWORD)
      .doc(email);
    const doc = await resetPasswordDocRef.get();

    if (!doc.exists) {
      throwCustomException(
        ERROR_MESSAGES.NO_RESET_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = doc.data();

    if (data.code !== code) {
      throwCustomException(ERROR_MESSAGES.INVALID_CODE, HttpStatus.BAD_REQUEST);
    }

    if (data.expiryTime < Date.now()) {
      throwCustomException(ERROR_MESSAGES.CODE_EXPIRED, HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.OK,
      message: SUCCESS_MESSAGES.CODE_RECOVERY_SUCCESS,
    };
  }

  async validateRecoveryCode(email: string, code: string): Promise<boolean> {
    const snapshot = await this.firebase.db
      .collection(this.COLLECTION_RESET_PASSWORD)
      .doc(email)
      .get();

    if (!snapshot.exists) {
      throwCustomException(
        ERROR_MESSAGES.EMAIL_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = snapshot.data();
    if (data.code !== code) {
      throwCustomException(
        ERROR_MESSAGES.INVALID_RECOVERY_CODE,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (data.expiryTime < Date.now()) {
      throwCustomException(ERROR_MESSAGES.CODE_EXPIRED, HttpStatus.BAD_REQUEST);
    }

    return true;
  }

  async updatePassword(
    token: string,
    email: string,
    newPassword: string,
  ): Promise<ValidationResponse> {
    const doc = await this.firebase.db
      .collection(this.COLLECTION_RESET_PASSWORD)
      .doc(email)
      .get();

    if (!doc.exists) {
      throwCustomException(
        ERROR_MESSAGES.NO_RESET_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = doc.data();

    if (data.code !== token) {
      throwCustomException(
        ERROR_MESSAGES.INVALID_TOKEN,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const snapshot = await this.validateInCollection(email, 'email');
    const userDoc = snapshot.docs[0];

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const updateResult = await this.firebase.db
      .collection(this.COLLECTION_USER)
      .doc(userDoc.id)
      .update({ password: hashedPassword });
    console.log('Update result:', updateResult);

    return {
      statusCode: HttpStatus.OK,
      message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
    };
  }

  async getAllUsers(): Promise<any[]> {
    const snapshot = await this.firebase.db
      .collection(this.COLLECTION_USER)
      .get();
    return snapshot.docs.map((doc) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = doc.data() as User;
      return userWithoutPassword;
    });
  }
}
