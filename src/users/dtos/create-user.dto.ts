import {IsAscii, IsEmail, IsString, MaxLength, MinLength} from 'class-validator';

import {ApiModelProperty} from '@nestjs/swagger';

export class CreateUserDto {
  @ApiModelProperty()
  @IsString()
  @MaxLength(16)
  @MinLength(2)
  readonly name: string;

  @ApiModelProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  @IsAscii()
  readonly password: string;
}