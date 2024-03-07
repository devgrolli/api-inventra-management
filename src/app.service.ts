import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async createCollectionDb(): Promise<string> {
    return 'This action adds a new collection';
  }
}
