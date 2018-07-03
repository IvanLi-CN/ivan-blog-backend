import {IsAscii, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiModelProperty()
  @IsString()
  @MaxLength(16)
  @MinLength(2)
  @IsOptional()
  readonly name?: string;

  @ApiModelProperty()
  @IsString()
  @IsAscii()
  @IsOptional()
  readonly newPassword?: string;

  @ApiModelProperty()
  @IsString()
  @IsAscii()
  readonly oldPassword: string;
}
