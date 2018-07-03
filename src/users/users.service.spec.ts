import {Test, TestingModule} from '@nestjs/testing';
import {UsersService} from './users.service';
import {CoreModule} from '../core/core.module';
import {User} from './user.entity';
import {Repository} from 'typeorm';
import {UserProviders, UserRepositoryToken} from './users.providers';
import * as bcrypt from 'bcrypt';
import {ConflictException, NotAcceptableException, UnauthorizedException} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;
  let repository: Repository<User>;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [UsersService, ...UserProviders],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(UserRepositoryToken);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test UsersService', () => {
    beforeEach(async () => {

      await repository.save([
        repository.create({name: 'test1', email: 'test1', password: await bcrypt.hash('pwd1', 10)}),
        repository.create({name: 'test2', email: 'test2', password: await bcrypt.hash('pwd2', 10)}),
        repository.create({name: 'test3', email: 'test3', password: await bcrypt.hash('pwd3', 10)}),
      ]);
    });
    afterEach(async () => {
      await repository.createQueryBuilder().delete().execute();
    });

    describe('registerUser', () => {
      it('should return a user', async () => {
        expect.assertions(1);
        const user = {name: 'test', email: 'test', password: 'test'};
        await expect(
          service.registerUser(user),
        ).resolves.toMatchObject({name: 'test', email: 'test'});
      });
      it('password should be encrypted', async () => {
        expect.assertions(1);
        const user = {name: 'test', email: 'test', password: 'test'};
        await expect(
          new Promise(resolve => {
            service.registerUser(user).then(u => {
              bcrypt.compare(user.password, u.password).then(b => {
                resolve(b);
              });
            });
          }),
        ).resolves.toBeTruthy();
      });
      it('should throw name exists exception', async () => {
        expect.assertions(1);
        const user = {name: 'test1', email: 'test', password: 'test'};
        await service.registerUser(user).catch(ex => {
          expect(ex.message).toMatchObject(new ConflictException('用户名已存在！').message);
        });
      });
      it('should throw email exists exception', async () => {
        expect.assertions(1);
        const user = {name: 'test', email: 'test1', password: 'test'};
        await service.registerUser(user).catch(ex => {
          expect(ex.message).toMatchObject(new ConflictException('电子邮箱已存在！').message);
        });
      });
    });
    describe('login', () => {
      it('should get a user', async () => {
        return await expect(
          service.login({email: 'test1', password: 'pwd1', captcha: '', remember: true}),
        ).resolves.toMatchObject({email: 'test1'});
      });
      it('should throw NotAcceptableException', async () => {
        expect.assertions(2);
        await expect(
          service.login({email: 'test1', password: 'pwd2', captcha: '', remember: true}),
        ).rejects.toBeInstanceOf(NotAcceptableException);
        await expect(
          service.login({email: 'test4', password: 'pwd4', captcha: '', remember: true}),
        ).rejects.toBeInstanceOf(NotAcceptableException);
      });
    });
    describe('updateUser', () => {
      it('should update success', async () => {
        await expect(
          new Promise(resolve => {
            repository.findOne({email: 'test1'}).then(user => {
              service.updateUser({name: 'newName', oldPassword: 'pwd1'}, user.id).then(() => {
                resolve(true);
              });
            });
          }),
        ).resolves.toBeTruthy();
      });
      it('should throw UnauthorizedException', async () => {
        await expect(
          (async () => {
            const user = await repository.findOne({email: 'test1'});
            return await service.updateUser({name: 'newName', oldPassword: 'p'}, user.id);
          })(),
        ).rejects.toBeInstanceOf(UnauthorizedException);
      });
    });
  });
});
