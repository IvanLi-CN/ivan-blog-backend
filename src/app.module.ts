import { Module, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { AccountsModule } from './accounts/accounts.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'blog',
      password: '',
      database: 'blog',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: true,
      engine: {
        rewriteError(err) {
          console.log('rewriteError', err);
          // Return `null` to avoid reporting `AuthenticationError`s
          if (err instanceof UnauthorizedException) {
            return null;
          }
          // All other errors will be reported.
          return err;
        },
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    CoreModule,
    ArticlesModule,
    TagsModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
