import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { FirebaseService } from '../firebase/firebase.service';

import path from 'path';

interface Product {
  idProduct: string;
  name: string;
  brandName: string;
  qtyStock: number;
  value: number;
}

@Injectable()
export class ProductService {
  constructor(private firebase: FirebaseService) {}

  calculate(data: { num1: number; num2: number }): number {
    const { num1, num2 } = data;
    return num1 + num2;
  }

  async getAllProducts() {
    const prodAll = await this.firebase.db.collection('Products').get();
    return prodAll.docs.map((doc) => doc.data());
  }

  async addProduct(data: Product): Promise<Product> {
    try {
      const docRef = this.firebase.db
        .collection('Products')
        .doc(data.idProduct);

      const doc = await docRef.get();

      if (doc.exists) {
        throw new HttpException(
          'Produto com este ID já existe',
          HttpStatus.BAD_REQUEST,
        );
      }

      await docRef.set({ id: docRef.id, ...data });

      return data;
    } catch (error) {
      throw new HttpException(
        'Erro ao adicionar produto: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadImage(fileName: any): Promise<string> {
    try {
      const bucket = await this.firebase.conectBucketStorage();
      const localFilePath = path.join(
        __dirname,
        '../../../src/assets/teste.jpg',
      );

      const file = bucket.file(`products/${fileName?.fileName}.jpg`);

      const [exists] = await file.exists();
      if (exists) {
        throw new HttpException(
          'Produto já possui imagem cadastrada',
          HttpStatus.AMBIGUOUS,
        );
      }

      await bucket.upload(localFilePath, {
        destination: file,
      });

      const config = {
        action: 'read',
        expires: '03-01-2500',
      };

      const [url] = await file.getSignedUrl(config as any);

      return url;
    } catch (error) {
      throw new HttpException(
        'Erro ao subir imagem do Produto: ' + error,
        HttpStatus.ACCEPTED,
      );
    }
  }
}
