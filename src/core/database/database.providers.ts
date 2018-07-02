import {createConnection} from 'typeorm';
import * as fs from 'fs';
import * as redis from 'redis';

export const DbConnectionToken = 'DbConnectionToken';
export const RedisClientToken = 'RedisClientToken';
export const databaseProviders = [
  {
    provide: DbConnectionToken,
    useFactory: async () => await createConnection(getOrmConfig()),
  },
  {
    provide: RedisClientToken,
    useFactory: () => {
      return new Promise((resolve, rejects) => {
        const client = redis.createClient();

        client.on('connect', () => {
          resolve(client);
        });

        client.on('error', err => {
          rejects(err);
        });
      });
    },
  },
];

function getOrmConfig() {
  let filePath: string;
  switch (process.env.NODE_ENV) {
    case 'test':
      filePath = 'ormconfig.test.json';
      break;
    // case 'dev':
    //   filePath = 'ormconfig.dev.json';
    //   break;
    // case 'prod':
    //   filePath = 'ormconfig.prod.json';
    //   break;
    default:
      filePath = 'ormconfig.json';
      break;
    // throw new Error('current node environment is unknown: ' + process.env.NODE_ENV);
  }
  try {
    const str = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(str);
  } catch (e) {
    throw new Error('can not load ormconfig.json!');
  }
}
