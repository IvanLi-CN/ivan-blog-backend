import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Account } from './account.entity';
import { AccountsService } from './accounts.service';
import { UpdateAccountInput } from './dtos/update-account.input';
import { RegisterAccountInput } from './dtos/register-account.input';
import { QueryAccountsArgs } from './dtos/query-accounts.args';
import { Int } from 'type-graphql';
import { UseGuards } from '@nestjs/common';
import { AccountGuard } from '../core/auth/guards/account.guard';
import { Roles } from '../core/auth/decorators/roles.decorator';
import { AccountTypes } from '../core/auth/account-types.enum';

@Resolver(of => Account)
export class AccountsResolver {
  constructor(
    private accountsService: AccountsService,
  ) {
  }

  @UseGuards(AccountGuard)
  @Roles(AccountTypes.admin)
  @Query(returns => [Account])
  async queryAccounts(@Args() args: QueryAccountsArgs): Promise<Account[]> {
    return await this.accountsService.query(args);
  }

  @Query(returns => Int)
  async queryAccountsCount(@Args() args: QueryAccountsArgs): Promise<number> {
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
    ): Promise<Account> {
    return await this.accountsService.update(id, input);
  }

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
