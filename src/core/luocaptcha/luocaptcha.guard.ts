import {CanActivate, ExecutionContext, Injectable, InternalServerErrorException} from '@nestjs/common';
import {LuocaptchaService} from './luocaptcha.service';
import {Request, Response} from 'express';

@Injectable()
export class LuocaptchaGuard implements CanActivate{
  constructor(
    private service: LuocaptchaService,
  ) {

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    try {
      if (await this.service.verifyCaptcha(req.headers['hc-verification'] as string)) {
        res.setHeader('hc-verification', 'success');
        return true;
      }
      res.setHeader('hc-verification', 'failed');
      return false;
    } catch (e) {
      res.setHeader('hc-verification', 'error');
      throw new InternalServerErrorException('Captcha (remote) service failed.')
    }
  }
}