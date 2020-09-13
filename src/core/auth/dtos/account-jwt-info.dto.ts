import { SystemRoles } from '../account-types.enum';

export class AccountJwtInfoDto {
  id: string;
  systemRole: SystemRoles;
  // permissions: UserPermissions[];
}
