import { ConfigService } from '@nestjs/config';
import { TConfiguration } from 'src/types';

export class ConfigurationService extends ConfigService<TConfiguration> {
  constructor() {
    super();
  }
}

export default () => ({
  jwtSecret: process.env.JWT_SECRET,
});
export * from './orm';
