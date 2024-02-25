import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';
import { BcryptService } from 'src/helpers/bcrypt.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ERROR_MESSAGES, NAME_LOCAL_AUTH_GUARD } from 'src/utils/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  NAME_LOCAL_AUTH_GUARD,
) {
  constructor(
    private readonly userService: UsersService,
    private readonly bcryptService: BcryptService,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.userService.findOneWithSelect(username, [
      'password',
      'id',
    ]);
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER.NOT_FOUND);
    }
    const isComparePassword = await this.bcryptService.comparePass(
      password,
      user.password,
    );
    if (isComparePassword === false) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER.NOT_CORRECT);
    }

    return user;
  }
}
