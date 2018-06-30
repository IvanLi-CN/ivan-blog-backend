import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {CoreModule} from "./core/core.module";
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [CoreModule, UsersModule, ArticlesModule, CommentsModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
