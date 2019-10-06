import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { StaffAccountInfoDto } from '../dtos/staff-account-info.dto';
import { CustomerAccountInfoDto } from '../dtos/customer-account-info.dto';
import { MpSessionsService } from '../../mp-sessions/mp-sessions.service';
import { FunctionMiddleware } from '@nestjs/common/interfaces/middlewares';

@Injectable()
export class MpSessionMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly mpSessionsService: MpSessionsService,
  ) {}
  resolve(context: string): FunctionMiddleware {
    return async (req, res, next) => {
      let sessionKey: string;
      if (req.staff) {
        sessionKey = (req.staff as StaffAccountInfoDto).sessionId;
      } else if (req.customer) {
        sessionKey = (req.customer as CustomerAccountInfoDto).sessionId;
      } else {
        req.MpSessionMiddleware = {
          message: '无法取得与微信小程序相关的信息。',
        };
        return next();
      }
      req.mpSession = await this.mpSessionsService.get(sessionKey);
      next();
    };
  }
}
