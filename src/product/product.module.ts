import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FirebaseModule, ConfigModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
