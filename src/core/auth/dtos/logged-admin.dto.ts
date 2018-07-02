import {LoggedUserDto} from "./logged-user.dto";
import {LoggedUserGroups} from "../enums/LoggedUserGroups";

export class LoggedAdminDto extends LoggedUserDto{
    readonly group: LoggedUserGroups.admin;
}