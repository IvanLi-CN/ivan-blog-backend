import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';

@Injectable()
export class RolePipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata) {
    return value ? LoggedUserGroups[value] : null;
  }
}
