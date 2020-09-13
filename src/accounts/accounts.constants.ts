import { Account } from './account.entity';
import { SystemRoles } from '../core/auth/account-types.enum';

export const ADMIN_ACCOUNT: Partial<Account> = {
  account: 'admin',
  id: '1',
  isActive: true,
  isDelete: false,
  nick: 'Admin',
  password: '123123',
  systemRole: SystemRoles.admin,
};
