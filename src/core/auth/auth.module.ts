import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthProviders } from './auth.providers';
import { AuthResolver } from './auth.resolver';
import { AccountsModule } from '../../accounts/accounts.module';

@Module({
  imports: [AccountsModule],
  providers: [AuthService, AuthResolver, ...AuthProviders],
  exports: [AuthService],
})
export class AuthModule {}
