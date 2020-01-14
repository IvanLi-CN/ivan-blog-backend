import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';
import { SystemRoles } from '../account-types.enum';

@Injectable()
export class RolePipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata) {
    return value ? SystemRoles[value] : null;
  }
}
