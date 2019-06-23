import { Module } from '@nestjs/common';
import { MarkdownService } from './services/markdown.service';

@Module({
  providers: [MarkdownService],
  exports: [MarkdownService],
})
export class CommonModule {}
