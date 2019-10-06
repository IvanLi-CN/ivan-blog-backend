import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/account.entity';
import { AuthTokenSetter } from './decorators/auth-token-setter.decorator';
import { BadRequestException, HttpStatus, InternalServerErrorException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Resolver(of => Account)
export class AuthResolver {
  constructor(
    private accountsService: AccountsService,
    private authService: AuthService,
  ) {
  }

  @Mutation(returns => Account)
  async memberLogin(
    @AuthTokenSetter() authTokenSetter,
    @Args({name: 'account', type: () => String, nullable: false}) account?: string,
    @Args({name: 'password', type: () => String, nullable: false}) password?: string,
    ): Promise<Account> {
    const user = await this.accountsService.findOneByAccountAndPassword(account, password);
    if (user) {
      try {
        console.log(this.authService, this.authService.sign4Admin, this.authService.sign4Member);
        const token = await this.authService.sign4Member({ id: user.id, permissions: null, role: null });
        await authTokenSetter(token);
        return user;
      } catch (e) {
        console.error(e);
        throw new InternalServerErrorException('登录服务出现异常，请重试！');
      }
    } else {
      throw new BadRequestException('用户名或对应的口令错误！');
    }
  }
}
