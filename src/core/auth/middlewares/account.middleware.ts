import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AccountTypes } from '../account-types.enum';
import { AccountJwtInfoDto } from '../dtos/account-jwt-info.dto';
import { AppRequest } from '../models/app-request.model';
import { Response } from 'express';

@Injectable()
export class AccountMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {
  }

  use(req: AppRequest, res: Response, next: () => void) {
    const authorization = req.header('authorization');
    if (!authorization) {
      return next();
    }
    let info: AccountJwtInfoDto;
    try {
      info = this.authService.getAccount(authorization);
    } catch (e) {
      res.header('authorization', '');
      return next();
    }
    if (info.role !== AccountTypes.admin && info.role !== AccountTypes.member) {
      throw new UnauthorizedException('非法的用户角色！');
    }
    if (isNaN(info.id)) {
      throw new UnauthorizedException('未知用户！');
    }
    req.user = info;
    next();
  }
}
