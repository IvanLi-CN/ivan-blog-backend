import {IsAscii, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(16)
  @MinLength(2)
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsAscii()
  @IsOptional()
  readonly newPassword?: string;

  @IsString()
  @IsAscii()
  readonly oldPassword: string;
}
