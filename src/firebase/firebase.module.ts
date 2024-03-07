import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

const firebaseProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    return admin;
  },
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider, FirebaseService],
  exports: [firebaseProvider, FirebaseService],
})
export class FirebaseModule {}
