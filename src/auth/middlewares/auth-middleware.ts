import { Injectable, NestMiddleware } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { TControllerParameters } from 'src/types';

import { ConfigurationService } from 'src/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigurationService,
    private readonly jwtService: JwtService,
  ) {}

  async use(...[req, _, next]: TControllerParameters) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = <{ id: number }>this.jwtService.verify(token, {
        secret: this.configService.get('jwtSecret'),
      });
      const user = await this.usersService.findById(decode.id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
