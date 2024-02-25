import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import {
  ERROR_MESSAGES,
  IS_PUBLIC_KEY,
  NAME_JWT_AUTH_GUARD,
} from 'src/utils/constants';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard(NAME_JWT_AUTH_GUARD) {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(...[err, user]: Parameters<IAuthGuard['handleRequest']>) {
    if (err || !user) {
      throw err || new UnauthorizedException(ERROR_MESSAGES.AUTH.NOT_AUTH);
    }

    return user;
  }
}
