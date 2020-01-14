import { SystemRoles } from '../account-types.enum';

export class AccountJwtInfoDto {
  id: number;
  systemRole: SystemRoles;
  // permissions: UserPermissions[];
}
