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

  static async verifyCaptcha(): Promise<boolean> {
    return true;
  }
}