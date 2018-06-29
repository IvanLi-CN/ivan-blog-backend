import { ConfigsInterface } from './configs.interface';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';

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
    useValue: {
      appid: 'wx33daeafb99fad240',
      appsecret: 'f71a9d2e21860108840f20a7cea1f792',
    },
  },
];
