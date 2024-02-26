import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationService } from 'src/config';
import { User } from 'src/users/entities/user.entity';
import { NAME_JWT_AUTH_GUARD } from 'src/utils/constants';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  NAME_JWT_AUTH_GUARD,
) {
  constructor(configService: ConfigurationService) {
    super({
      secretOrKey: configService.get('jwtSecret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  validate(user: User) {
    return user;
  }
}
