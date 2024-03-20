import { HttpException, HttpStatus } from '@nestjs/common';

export const throwCustomException = (message: string, status: HttpStatus) => {
  throw new HttpException(message, status);
};
