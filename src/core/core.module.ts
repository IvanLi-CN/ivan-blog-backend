import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {DatabaseModule} from './database/database.module';
import {AuthModule} from './auth/auth.module';
import {UuidModule} from './uuid/uuid.module';
import {ConfigModule} from './configs/config.module';
import {LuoCaptchaModule} from './luocaptcha/luocaptcha.module';
import {AccountMiddleware} from './auth/middlewares/account.middleware';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UuidModule,
    ConfigModule,
    LuoCaptchaModule,
  ],
  exports: [
    DatabaseModule,
    AuthModule,
    UuidModule,
    ConfigModule,
    LuoCaptchaModule,
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(AccountMiddleware)
      .forRoutes('*');
  }
}
