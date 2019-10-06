import { IsAlphanumeric, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UserLoginWithPasswordDto {
  @IsPhoneNumber('CN')
  phone: string;
  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;
}
