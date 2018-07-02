import {LoggedUserDto} from "../../core/auth/dtos/logged-user.dto";
import {LoggedUserInfoInterface} from "../interfaces/logged-user-info.interface";

export class LoggedUserInfoDto extends LoggedUserDto implements LoggedUserInfoInterface{
  accessToken: string;
  refreshToken: string;
}