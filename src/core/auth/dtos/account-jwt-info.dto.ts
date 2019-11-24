import { AccountTypes } from '../account-types.enum';

export class AccountJwtInfoDto {
  id: number;
  role: AccountTypes;
  // permissions: UserPermissions[];
}
