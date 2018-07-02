import {Connection} from 'typeorm';
import {DbConnectionToken} from '../core/database/database.providers';
import {User} from "./user.entity";

export const UserRepositoryToken = 'UserRepositoryToken';
export const UserProviders = [
  {
    provide: UserRepositoryToken,
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: [DbConnectionToken],
  },
];
