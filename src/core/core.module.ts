import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UuidModule } from './uuid/uuid.module';
import { ConfigModule } from './configs/config.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UuidModule,
    ConfigModule,
  ],
  exports: [
    DatabaseModule,
    AuthModule,
    UuidModule,
    ConfigModule,
  ],
})
export class CoreModule {}
