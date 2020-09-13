import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../articles/article.entity';
import { CommonModule } from '../common/common.module';
import { Account } from './account.entity';
import { AccountsResolver } from './accounts.resolver';
import { AccountsService } from './accounts.service';
import { InitAccountsService } from './init-accounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Account]),
    CommonModule,
  ],
  providers: [AccountsResolver, AccountsService, InitAccountsService],
  exports: [AccountsService],
})
export class AccountsModule {
}
