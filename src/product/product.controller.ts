import {
  Get,
  Post,
  Body,
  UsePipes,
  Controller,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductModel } from '../model/product.model';
import axios from 'axios';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('calculate')
  calculate(@Body() data: { num1: number; num2: number }): number {
    return this.productService.calculate(data);
  }

  @Get('getAllProducts')
  async getAllProducts(): Promise<any> {
    return await this.productService.getAllProducts();
  }

  @Post('addProduct')
  @UsePipes(ValidationPipe)
  async addProduct(@Body() product: ProductModel): Promise<ProductModel> {
    return await this.productService.addProduct(product);
  }

  @Post('uploadImage')
  async uploadImage(@Body() fileName: string): Promise<string> {
    return await this.productService.uploadImage(fileName);
  }

  @Post('chat')
  async sendMessage(prompt: string): Promise<string> {
    try {
      const model = 'gpt-3.5-turbo';
      const response = await axios.post(
        `https://api.openai.com/v1/engines/${model}/completions`,
        {
          prompt,
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error(
        'Erro ao enviar mensagem para o ChatGPT:',
        error.response.data,
      );
      throw new Error('Erro ao comunicar com o ChatGPT');
    }
  }
}
