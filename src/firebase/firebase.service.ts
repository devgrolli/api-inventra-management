import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private fireStorageUrl: string;
  db: admin.firestore.Firestore;
  constructor(private configService: ConfigService) {
    this.db = admin.firestore();
    this.fireStorageUrl = this.configService.get<string>('FIRE_STORAGE_URL');
  }

  async conectBucketStorage() {
    return admin.storage().bucket(this.fireStorageUrl);
  }
}
