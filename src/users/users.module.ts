import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UserProviders} from "./users.providers";
import {CoreModule} from "../core/core.module";

@Module({
  imports: [CoreModule],
  providers: [UsersService, ...UserProviders]
})
export class UsersModule {}
