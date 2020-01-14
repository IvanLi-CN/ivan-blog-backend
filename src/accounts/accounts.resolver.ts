import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Account } from './account.entity';
import { AccountsService } from './accounts.service';
import { UpdateAccountInput } from './dtos/update-account.input';
import { RegisterAccountInput } from './dtos/register-account.input';
import { QueryAccountsArgs } from './dtos/query-accounts.args';
import { Int } from 'type-graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { AccountGuard } from '../core/auth/guards/account.guard';
import { Roles } from '../core/auth/decorators/roles.decorator';
import { allRoles, SystemRoles } from '../core/auth/account-types.enum';
import { CurrentUser } from '../core/auth/decorators/current-user.decorator';
import { AccountJwtInfoDto } from '../core/auth/dtos/account-jwt-info.dto';
import { AccountInfoDto } from './dtos/account-info.dto';

@UseGuards(AccountGuard)
@Roles()
@Resolver(of => Account)
export class AccountsResolver {
  constructor(
    private accountsService: AccountsService,
  ) {
  }

  @Roles(SystemRoles.admin)
  @Query(returns => [Account])
  async account(
    @Args({name: 'id', type: () => Int}) id: number,
  ): Promise<Account> {
    return await this.accountsService.findOne(id);
  }

  @Roles(SystemRoles.admin)
  @Query(returns => [Account])
  async accounts(@Args() args: QueryAccountsArgs): Promise<Account[]> {
    return await this.accountsService.query(args);
  }

  @Roles(...allRoles)
  @Query(returns => AccountInfoDto)
  async currAccount(@CurrentUser() currUser): Promise<AccountInfoDto> {
    return await this.accountsService.findOne(currUser.id);
  }

  @Query(returns => Int)
  async accountsCount(@Args() args: QueryAccountsArgs): Promise<number> {
    return await this.accountsService.count(args);
  }

  @Mutation(returns => Account)
  async registerAccount(@Args('registerAccountInput')input: RegisterAccountInput): Promise<Account> {
    return await this.accountsService.create(input);
  }

  @Mutation(returns => Account)
  async updateAccount(
    @Args('updateAccountInput') input: UpdateAccountInput,
    @Args('id') id: number,
    @CurrentUser() user: AccountJwtInfoDto,
    ): Promise<Account> {
    if (user.systemRole !== SystemRoles.admin && user.id !== id) {
      throw new ForbiddenException('您无权修改他人账户信息！');
    }
    return await this.accountsService.update(id, input);
  }

  @Roles(SystemRoles.admin)
  @Mutation(returns => Boolean)
  async removeAccount(
    @Args({name: 'id', type: () => Int, nullable: true}) id?: number,
    @Args({name: 'ids', type: () => [Int], nullable: true}) ids?: number[],
    ): Promise<true> {
    const tmpIds = [];
    Array.isArray(ids) && tmpIds.push(...tmpIds);
    id !== undefined && tmpIds.push(id);
    await this.accountsService.remove(tmpIds);
    return true;
  }
}
