import { Injectable } from '@nestjs/common';
import marked = require('marked');

@Injectable()
export class MarkdownService {
  prase(mdText: string) {
    return marked(mdText);
  }
}
