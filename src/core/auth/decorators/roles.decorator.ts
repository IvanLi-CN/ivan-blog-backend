import { createParamDecorator, assignMetadata, SetMetadata } from '@nestjs/common';
import { AccountTypes } from '../account-types.enum';
import { createMethodDecorator } from 'type-graphql';

export const Roles = ((...roles: AccountTypes[]) => {
  return SetMetadata<string, AccountTypes[]>('roles', roles);
});
