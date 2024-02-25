import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TConfiguration } from 'src/types';

@Injectable()
export class ConfigurationService extends ConfigService<TConfiguration> {
  constructor(internalConfig?: Record<string, any>) {
    super(internalConfig);
  }
}

export default () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: '1d',
});
export * from './orm';
