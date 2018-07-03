import {IsAscii, IsEmail, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class AdminUpdateUserDto {
  @ApiModelProperty()
  @IsString()
  @IsAscii()
  @IsOptional()
  readonly password?: string;
  @ApiModelProperty()
  @IsString()
  @MaxLength(16)
  @MinLength(2)
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty()
  @ApiModelProperty()
  @MaxLength(60, {message: '地址太长'})
  @IsEmail(undefined , {message: '请填写一个 E-Mail 地址'})
  @IsOptional()
  readonly email?: string;
}