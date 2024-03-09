import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ProductModel {
  @IsNotEmpty({ message: 'O código do produto é obrigatório.' })
  idProduct: string;

  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  name: string;

  @IsNotEmpty({ message: 'O nome da marca é obrigatório.' })
  @IsString({ message: 'O nome da marca deve ser uma string.' })
  brandName: string;

  @IsNotEmpty({ message: 'A quantidade em estoque é obrigatória.' })
  @IsNumber({}, { message: 'A quantidade em estoque deve ser um número.' })
  qtyStock: number;

  @IsNotEmpty({ message: 'O valor do produto é obrigatório.' })
  @IsNumber({}, { message: 'O valor do produto deve ser um número.' })
  value: number;
}
