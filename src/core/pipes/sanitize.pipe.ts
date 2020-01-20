import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { sanitize } from '@neuralegion/class-sanitizer/dist';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log(value, typeof value, value instanceof Object);
    if (typeof value === 'object') {
      value = Object.assign(new metadata.metatype(), value);
      sanitize(value);
      // console.log(value);
    }
    return value;
  }
}
