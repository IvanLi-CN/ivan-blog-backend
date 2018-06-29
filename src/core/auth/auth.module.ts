import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthProviders } from './auth.providers';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...AuthProviders],
  exports: [AuthService],
})
export class AuthModule {}
