import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/account.entity';
import { AuthTokenSetter } from './decorators/auth-token-setter.decorator';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SystemRoles } from './account-types.enum';

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
    if (user && user.systemRole === SystemRoles.member) {
      try {
        const token = await this.authService.sign4Member({ id: user.id, /*permissions: null, */systemRole: null });
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
  @Mutation(returns => Account)
  async adminLogin(
    @AuthTokenSetter() authTokenSetter,
    @Args({name: 'account', type: () => String, nullable: false}) account?: string,
    @Args({name: 'password', type: () => String, nullable: false}) password?: string,
    ): Promise<Account> {
    const user = await this.accountsService.findOneByAccountAndPassword(account, password);
    if (user && user.systemRole === SystemRoles.admin) {
      try {
        const token = await this.authService.sign4Admin({ id: user.id, /*permissions: null, */systemRole: null });
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
