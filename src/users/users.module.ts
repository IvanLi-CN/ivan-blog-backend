import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UserProviders} from './users.providers';
import {CoreModule} from '../core/core.module';
import {UsersController} from './users.controller';

@Module({
  imports: [CoreModule],
  providers: [UsersService, ...UserProviders],
  controllers: [UsersController],
})
export class UsersModule {}
