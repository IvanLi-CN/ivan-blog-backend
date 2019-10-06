import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountMiddleware } from './auth/middlewares/account.middleware';

@Module({
  imports: [AuthModule],
})
export class CoreModule implements NestModule {
configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccountMiddleware)
      .forRoutes('*');
  }
}
