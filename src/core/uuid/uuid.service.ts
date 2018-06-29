import { Injectable } from '@nestjs/common';
import uuidv4 = require('uuid/v4');

@Injectable()
export class UuidService {
  constructor() {}
  public next = () => uuidv4();
}
