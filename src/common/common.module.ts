import { Module } from '@nestjs/common';
import { MarkdownService } from './services/markdown.service';
import { PasswordConverter } from './services/password-converter';

@Module({
  providers: [MarkdownService, PasswordConverter],
  exports: [MarkdownService, PasswordConverter],
})
export class CommonModule {}
