import {ReflectMetadata} from '@nestjs/common';
import {LoggedUserGroups} from './enums/LoggedUserGroups';

export const Roles = (...roles: LoggedUserGroups[]) =>
  ReflectMetadata('roles', roles);
