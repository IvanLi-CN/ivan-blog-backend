import {ConfigsInterface} from './configs.interface';
import {Observable, ReplaySubject} from 'rxjs';
import * as fs from 'fs';

export const Configs$Token = 'Config$Token';
export const ConfigSubjectToken = 'ConfigSubjectToken';
export const BaseConfigsToken = 'BaseConfigsToken';
export const ConfigProviders = [
  {
    provide: ConfigSubjectToken,
    useFactory: (config: ConfigsInterface) => {
      return new Promise(resolve => {
        const subject = new ReplaySubject<ConfigsInterface>(1);
        subject.next(config);
        resolve(subject);
      });
    },
    inject: [BaseConfigsToken],
  },
  {
    provide: Configs$Token,
    useFactory: (subject: ReplaySubject<ConfigsInterface>) => {
      return new Promise<Observable<ConfigsInterface>>(resolve =>
        resolve(subject),
      );
    },
    inject: [ConfigSubjectToken],
  },
  {
    provide: BaseConfigsToken,
    useFactory: async () => {
      return new Promise((resolve, reject) => {
        try {
          fs.readFile('config.json', 'utf-8', (err, data) => {
            if(err) {
              return reject(err);
            }
            resolve(JSON.parse(data));
          });
        } catch (e) {
          reject(new Error('can not load config.json!'));
        }
      })
    }
  },
];
