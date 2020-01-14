import { SetMetadata } from '@nestjs/common';
import { SystemRoles } from '../account-types.enum';

export const Roles = ((...roles: SystemRoles[]) => {
  return SetMetadata<string, SystemRoles[]>('roles', roles);
});
