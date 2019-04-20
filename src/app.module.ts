import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ArticlesResolver } from './articles/articles.resolver';
import { ArticlesService } from './articles/articles.service';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: true,
      playground: true,
    }),
    TypeOrmModule.forRoot(),
    ArticlesModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, ArticlesResolver, ArticlesService],
})
export class AppModule {}
