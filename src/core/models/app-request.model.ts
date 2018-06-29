import { Request } from 'express';

export interface AppRequest extends Request {
  admin: LoggedAdminDto;
  user: LoggedUserDto;
  userId: number;
}
