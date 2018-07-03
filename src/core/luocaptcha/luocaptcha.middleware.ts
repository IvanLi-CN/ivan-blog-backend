import {BadRequestException, Injectable, InternalServerErrorException, NestMiddleware} from '@nestjs/common';
import * as FormData from 'form-data'
import {FunctionMiddleware} from '@nestjs/common/interfaces/middlewares';

@Injectable()
export class LuoCaptchaMiddleware implements NestMiddleware {

  resolve(context: string): FunctionMiddleware {
      return async (req, res, next) => {
        if (req.headers['hc-verification']) {
          try {
            if (await this.checkCaptcha(req.headers['hc-verification'])) {
              next();
              return;
            }
          }catch (e) {
            throw new InternalServerErrorException('服务器内部错误！')
          }
        }
        throw new BadRequestException('人机验证不通过，请重新验证！')
      }
  }
  async checkCaptcha(captcha: string): Promise<boolean> {
    try {

      const resData = await new Promise<string>((resolve, reject) => {
        try {
          const form = new FormData();
          form.append('api_key', process.env.LUOSIMAO_API_KEY);
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
