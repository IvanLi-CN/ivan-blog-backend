import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppService} from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Welcome to Ivan\'Blog! ( https://ivanli.cc/ )"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.root()).toBe('Welcome to Ivan\'Blog! ( https://ivanli.cc/ )');
    });
  });
});
