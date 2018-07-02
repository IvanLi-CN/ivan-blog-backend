import {LoggedUserInfoInterface} from "../interfaces/logged-user-info.interface";
import {LoggedAdminDto} from "../../core/auth/dtos/logged-admin.dto";

export class LoggedUserInfoDto extends LoggedAdminDto implements LoggedUserInfoInterface{
  accessToken: string;
  refreshToken: string;
}