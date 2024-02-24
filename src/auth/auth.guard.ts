import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ERROR_MESSAGES } from 'src/utils/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    if (req.user || ['/wishes/last', '/wishes/top'].includes(req.originalUrl))
      return true;

    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.NOT_AUTH);
  }
}
