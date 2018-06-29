import {
  BadGatewayException,
} from '@nestjs/common';

export class RemoteFailedException extends BadGatewayException {
  constructor(message = '网络波动，目标主机无应答！') {
    super(message);
  }
}
