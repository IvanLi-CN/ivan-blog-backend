import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPrivateKeyToken, JwtPublicKeyToken } from './auth.providers';
import * as JWT from 'jsonwebtoken';
import { AccountTypes } from './account-types.enum';
import { AccountJwtInfoDto } from './dtos/account-jwt-info.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtPrivateKeyToken) private readonly privateKey: string,
    @Inject(JwtPublicKeyToken) private readonly publicKey: string,
  ) {}

  verify(
    token: string,
  ): AccountJwtInfoDto {
    return JWT.verify(token, this.publicKey) as any;
  }

  sign4Member({ id, permissions }: AccountJwtInfoDto, expiresIn = '15m') {
    const dto: AccountJwtInfoDto = { id, permissions, role: AccountTypes.member };
    return JWT.sign(
      dto,
      this.privateKey,
      { expiresIn },
    );
  }

  sign4Admin({ id, permissions }: AccountJwtInfoDto, expiresIn = '15m') {
    const dto: AccountJwtInfoDto = { id, permissions, role: AccountTypes.admin };
    return JWT.sign(
      dto,
      this.privateKey,
      { expiresIn },
    );
  }

  getAccount(
    authorization: string,
  ): AccountJwtInfoDto {
    const index = authorization.indexOf('Bearer');
    if (index === -1) {
      throw new UnauthorizedException('身份认证凭据类型不被接受！');
    }
    const token = authorization.substr(index + 7).trim();
    try {
      return this.verify(token);
    } catch (e) {
      throw new UnauthorizedException('非法的身份认证凭据！');
    }
  }
}
