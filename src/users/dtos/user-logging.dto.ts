import {IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';

import {ApiModelProperty} from '@nestjs/swagger';

export class UserLoggingDto {
  @ApiModelProperty()
  @MaxLength(60, {message: '地址太长'})
  @IsEmail(undefined , {message: '请填写一个 E-Mail 地址'})
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  @MaxLength(128)
  @MinLength(2)
  readonly password: string;

  @ApiModelProperty()
  @IsBoolean()
  @IsOptional()
  readonly remember: boolean = false;

}