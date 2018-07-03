import * as FormData from 'form-data'
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ConfigsInterface} from '../configs/configs.interface';
import {Observable} from 'rxjs/internal/Observable';
import {Configs$Token} from '../configs/config.providers';

@Injectable()
export class LuocaptchaService implements OnModuleInit{
  private configs: ConfigsInterface;
  constructor(
    @Inject(Configs$Token)
    private configs$: Observable<ConfigsInterface>
  ){

  }

  onModuleInit(): any {
    this.configs$.subscribe(value => this.configs = value);
  }

  async verifyCaptcha(captcha: string): Promise<boolean> {
    if (!captcha) return false;
    try {
      const resData = await new Promise<string>((resolve, reject) => {
        try {
          const form = new FormData();
          form.append('api_key', this.configs.luosimao.apiKey);
          form.append('response', captcha);
          form.submit('https://captcha.luosimao.com/api/site_verify', function (err, res) {
            let data = '';
            res
              .setEncoding('utf-8')
              .on('data', c => {
                data += c;
              }).on('end', () => {
              resolve(data)
            }).resume();
          });
        } catch (e) {
          reject(e)
        }
      });

      const data = JSON.parse(resData);
      if (data.res === 'success')
        return true;
      else if (data.res === 'failed')
        return false;
      else console.warn('luosimao msg', data.error, data.msg);
    } catch (e) {
      if (e.response)
        console.warn('luosimao failed', e.response.status, e.response.data);
      else
        throw e;
    }
    return false;
  }
}