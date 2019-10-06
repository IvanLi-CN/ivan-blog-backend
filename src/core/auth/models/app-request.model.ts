import { Request } from 'express';
import { AccountJwtInfoDto } from '../dtos/account-jwt-info.dto';

export interface AppRequest extends Request {
  user?: AccountJwtInfoDto;
}
