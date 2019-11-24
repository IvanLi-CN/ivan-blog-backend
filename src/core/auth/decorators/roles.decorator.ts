import { SetMetadata } from '@nestjs/common';
import { AccountTypes } from '../account-types.enum';

export const Roles = ((...roles: AccountTypes[]) => {
  return SetMetadata<string, AccountTypes[]>('roles', roles);
});
