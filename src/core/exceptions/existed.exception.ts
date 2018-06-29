import { ConflictException } from '@nestjs/common';

export class ExistedException extends ConflictException {
  constructor(message = 'Existed') {
    super(message);
  }
}
