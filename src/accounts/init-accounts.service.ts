import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ADMIN_ACCOUNT } from './accounts.constants';
import debug = require('debug');
import { PasswordConverter } from '../common/services/password-converter';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
const log = debug('app:ivan:init-user');
@Injectable()
export class InitAccountsService implements OnModuleInit {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
    private readonly passwordConverter: PasswordConverter,
  ) {
  }
  onModuleInit(): any {
    this.make().then();
  }

  async make() {
    let adminUser = await this.repository.findOne({id: ADMIN_ACCOUNT.id});
    if (adminUser) {
      log(' ADMIN_ACCOUNT 正常。');
    } else {
      log('开始创建 ADMIN_ACCOUNT。');
      adminUser = await this.repository.save(this.repository.create(ADMIN_ACCOUNT));

      await this.repository.update(
        {id: adminUser.id},
        {
          ...ADMIN_ACCOUNT,
          password: await this.passwordConverter.convertToStore(ADMIN_ACCOUNT.password),
        },
      );
      log('完成创建 ADMIN_ACCOUNT。');
    }
  }

}
