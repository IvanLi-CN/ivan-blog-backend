import { ArgumentMetadata, Injectable, ParseIntPipe, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdPipe implements PipeTransform {
  parseIntPipe = new ParseIntPipe();
  transform(value: any, metadata: ArgumentMetadata) {
    return this.parseIntPipe.transform(value, metadata);
  }
}
