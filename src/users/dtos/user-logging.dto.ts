import {IsBoolean, IsEmail, IsEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class UserLoggingDto {
  @MaxLength(60, {message: '地址太长'})
  @IsEmail(undefined , {message: '请填写一个 E-Mail 地址'})
  readonly email: string;

  @IsString()
  @MaxLength(128)
  @MinLength(2)
  readonly password: string;

  @IsBoolean()
  @IsOptional()
  readonly remember: boolean = false;

  @IsEmpty()
  readonly captcha: string;

}