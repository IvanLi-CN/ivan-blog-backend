import {Module} from '@nestjs/common';
import {ConfigModule} from '../configs/config.module';
import {LuocaptchaService} from './luocaptcha.service.dev';


@Module({
  imports: [ConfigModule],
  providers: [LuocaptchaService],
  exports: [LuocaptchaService]
})
export class LuoCaptchaModule{

}
