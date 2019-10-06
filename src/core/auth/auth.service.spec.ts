import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as Jwt from 'jsonwebtoken';
import { JwtPrivateKeyToken, JwtPublicKeyToken } from './auth.providers';
import { RestaurantAccountInfoDto } from './dtos/restaurant-account-info.dto';
import { CustomerAccountInfoDto } from './dtos/customer-account-info.dto';

describe('AuthService', () => {
  const secret = '123abc';
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthService],
      providers: [AuthService],
    })
      .overrideProvider(JwtPrivateKeyToken)
      .useValue(secret)
      .overrideProvider(JwtPublicKeyToken)
      .useValue(secret)
      .compile();
  });

  describe('sign4Staff', () => {
    it('should return a verified token', () => {
      const staffAccount = { name: 'testname', id: 123, restaurantId: 123 };
      expect(
        (() => {
          const token = app
            .get<AuthService>(AuthService)
            .sign4Staff({ ...staffAccount, testProp: 'test' } as any);
          return Jwt.verify(token, secret);
        })(),
      ).toMatchObject(staffAccount);
    });
    it('必须返回只包含必要信息的 token', () => {
      const staffAccount = { name: 'testname', id: 123, restaurantId: 123 };
      expect(
        (() => {
          const token = app
            .get<AuthService>(AuthService)
            .sign4Staff({ ...staffAccount, testProp: 'test' } as any);
          return Jwt.verify(token, secret);
        })(),
      ).not.toHaveProperty('testProp');
    });
    it('必须抛出一个错误', () => {
      expect(() =>
        app.get<AuthService>(AuthService).sign4Staff(null),
      ).toThrow();
    });
  });
  describe('sign4Restaurant', () => {
    it('should return a valid token', () => {
      const RestaurantAccount: RestaurantAccountInfoDto = {
        name: 'testname',
        id: 123,
        account: 'testaccount',
      };
      expect(
        (() => {
          const token = app
            .get<AuthService>(AuthService)
            .sign4Restaurant({ ...RestaurantAccount, testProp: 'test' } as any);
          return Jwt.verify(token, secret);
        })(),
      ).toMatchObject(RestaurantAccount);
    });
    it('必须返回只包含必要信息的 token', () => {
      const RestaurantAccount: RestaurantAccountInfoDto = {
        name: 'testname',
        id: 123,
        account: 'testaccount',
      };
      expect(
        (() => {
          const token = app
            .get<AuthService>(AuthService)
            .sign4Restaurant({ ...RestaurantAccount, testProp: 'test' } as any);
          return Jwt.verify(token, secret);
        })(),
      ).not.toHaveProperty('testProp');
    });
    it('必须抛出一个错误', () => {
      expect(() =>
        app.get<AuthService>(AuthService).sign4Restaurant(null),
      ).toThrow();
    });
  });
  describe('sign4Customer', () => {
    it('should return a valid token', () => {
      const account: CustomerAccountInfoDto = {
        sessionId: '123',
        orderId: '123',
      };
      expect(
        (() => {
          const token = app
            .get<AuthService>(AuthService)
            .sign4Customer({ ...account, testProp: 'test' } as any);
          return Jwt.verify(token, secret);
        })(),
      ).toMatchObject(account);
    });
    it('必须返回只包含必要信息的 token', () => {
      const account: CustomerAccountInfoDto = {
        sessionId: '123',
        orderId: '123',
      };
      expect(
        (() => {
          const token = app
            .get<AuthService>(AuthService)
            .sign4Customer({ ...account, testProp: 'test' } as any);
          return Jwt.verify(token, secret);
        })(),
      ).not.toHaveProperty('testProp');
    });
    it('必须抛出一个错误', () => {
      expect(() =>
        app.get<AuthService>(AuthService).sign4Customer(null),
      ).toThrow();
    });
  });

  const verifiedStaffToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG5hbWUiLCJpZCI6MTAwMDAsInJlc3RhdXJhbnRJZCI6MTAwMDAsImlhdCI6MjAwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAxfQ.3ZPpzsfdWpymc_lYSS1xdmLx-8SbhNt6DOTZbp3c9qA';
  const invalidStaffToken1 =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG5hbWUiLCJpZCI6MTAwMDAsInJlc3RhdXJhbnQiOjEwMDAwLCJpYXQiOjEwMDAwMDAwMDAsImV4cCI6MTAwMDAwMDAwMX0.51QFbU1Lj3FjJyha7pdIdl7lKkd2EwS7xQVw4Qlfwko';
  const verifiedRestaurantToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG5hbWUiLCJpZCI6MTAwMDAsImFjY291bnQiOiJ0ZXN0YWNjb3VudCIsImlhdCI6MTAwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.C0OqMoEf45-LY_qq-KT1HfCeFin2yJPNfpjU10iGiqs';
  const invalidSignRestaurantToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG5hbWUiLCJpZCI6MTAwMDAsImFjY291bnQiOiJ0ZXN0YWNjb3VudCIsImlhdCI6MTAwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.ooV7RZrDNtjrVcaKhWpN3rpk4kvzXwQRL8SaVthCCg4';
  describe('verify4Staff', () => {
    it('should return decoded payload', () => {
      expect(
        app.get<AuthService>(AuthService).verify(verifiedStaffToken),
      ).toBeDefined();
    });
    it('should return decoded payload', () => {
      expect(
        app.get<AuthService>(AuthService).verify(verifiedRestaurantToken),
      ).toBeDefined();
    });
    it('result should be different', () => {
      expect(
        app.get<AuthService>(AuthService).verify(verifiedStaffToken),
      ).not.toEqual(
        app.get<AuthService>(AuthService).verify(verifiedRestaurantToken),
      );
    });
    it('should throw error', () => {
      expect(() =>
        app.get<AuthService>(AuthService).verify(invalidStaffToken1),
      ).toThrow();
    });
    it('should throw error', () => {
      expect(() =>
        app.get<AuthService>(AuthService).verify(invalidSignRestaurantToken),
      ).toThrow();
    });
  });
});
