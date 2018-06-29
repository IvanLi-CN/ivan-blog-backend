import { Module } from '@nestjs/common';
import { ConfigProviders } from './config.providers';

@Module({
  imports: [],
  providers: [...ConfigProviders],
  exports: [...ConfigProviders],
})
export class ConfigModule {}
