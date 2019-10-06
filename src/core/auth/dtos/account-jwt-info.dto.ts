import { AccountTypes } from '../account-types.enum';
import { UserPermissions } from '../../../users/user-permissions.enum';

export class AccountJwtInfoDto {
  id: number;
  role: AccountTypes;
  permissions: Array<UserPermissions>;
}
