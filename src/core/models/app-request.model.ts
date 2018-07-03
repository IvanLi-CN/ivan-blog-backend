import {Request} from 'express';
import {LoggedAdminDto} from '../auth/dtos/logged-admin.dto';
import {LoggedUserDto} from '../auth/dtos/logged-user.dto';

export interface AppRequest extends Request {
  admin: LoggedAdminDto;
  user: LoggedUserDto;
  member: LoggedUserDto;
  userId: number;
}
