import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder, Transaction, TransactionManager } from 'typeorm';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDbService } from '../common/services/base-db.service';
import { UpdateAccountInput } from './dtos/update-account.input';
import { RegisterAccountInput } from './dtos/register-account.input';
import { QueryAccountsArgs } from './dtos/query-accounts.args';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountsService extends BaseDbService<Account> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super();
  }

  @Transaction()
  async create(input: RegisterAccountInput, @TransactionManager() manager?: EntityManager): Promise<Account> {
    const accountRepository = manager.getRepository(Account);
    await this.isDuplicateEntity<RegisterAccountInput>(accountRepository, input, ['account', 'nick']);
    return await accountRepository.save(
      accountRepository.create({
        ...input,
        password: await bcrypt.hash(input.password, await bcrypt.genSalt()),
      }),
    );
  }

  @Transaction()
  async update(id: number, input: UpdateAccountInput, @TransactionManager() manager?: EntityManager) {
    const accountRepository = manager.getRepository(Account);
    const old = await accountRepository.findOneOrFail({ id });
    await this.isDuplicateEntityForUpdate(accountRepository, id, input, ['account', 'nick']);
    return await accountRepository.save(
      accountRepository.merge(old, {
        ...input,
        password: await bcrypt.hash(input.password, await bcrypt.genSalt()),
      }),
    );
  }

  async remove(ids: number[], restore = false): Promise<void> {
    await this.accountRepository.update(ids, { isDelete: restore });
  }

  async query(conditions: QueryAccountsArgs): Promise<Account[]> {
    const qb = await this.filter(conditions);
    return qb.getMany();
  }

  async count(conditions: QueryAccountsArgs): Promise<number> {
    const qb = await this.filter(conditions);
    return await qb.getCount();
  }

  async filter(conditions: QueryAccountsArgs): Promise<SelectQueryBuilder<Account>> {
    const qb = this.accountRepository.createQueryBuilder('account');
    AccountsService.filterLike(qb, 'account', 'account', conditions);
    AccountsService.filterLike(qb, 'account', 'nick', conditions);
    AccountsService.baseQuery(qb, 'account', conditions);
    return qb;
  }

  async isFieldValueAvailable(field: string, value: any) {
    const result = await this.accountRepository.findOne({ [field]: value });
    return !result;
  }

  async findOneByAccountAndPassword(account: string, password: string) {
    const user = await this.accountRepository.findOne({account}, {
      select: ['id', 'password', 'account', 'nick', 'systemRole'],
    });
    if (!user || !user.password || !await bcrypt.compare(password, Buffer.from(user.password).toString())) {
      throw new BadRequestException('账号或密码错误！');
    }
    const tmp = { ...user };
    delete tmp.password;
    return tmp;
  }

  async findOne(id: number) {
    return await this.accountRepository.findOne({id}, {
      select: ['id', 'account', 'nick', 'systemRole'],
    });
  }
}
