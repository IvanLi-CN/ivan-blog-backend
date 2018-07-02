import {IsAscii, IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(16)
  @MinLength(2)
  readonly name: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsAscii()
  readonly password: string;
}