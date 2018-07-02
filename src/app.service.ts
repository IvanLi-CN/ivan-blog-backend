import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {
  root(): string {
    return 'Welcome to Ivan\'Blog! ( https://ivanli.cc/ )';
  }
}
