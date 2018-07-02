import {LoggedUserGroups} from "../enums/LoggedUserGroups";

export class LoggedUserDto {
    email: string;
    id: number;
    group: LoggedUserGroups;
}