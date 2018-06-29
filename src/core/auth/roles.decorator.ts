import { ReflectMetadata } from '@nestjs/common';

export const Roles = (...roles: LoggedUserGroups[]) =>
  ReflectMetadata('roles', roles);
