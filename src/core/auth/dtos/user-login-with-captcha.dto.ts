import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UserLoginWithCaptchaDto {
  @IsPhoneNumber('CN')
  phone: string;
  @IsNotEmpty()
  captcha: string;
}
