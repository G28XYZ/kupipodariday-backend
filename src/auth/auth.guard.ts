import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    console.log('[AuthGuard]', req.user);

    if (req.user) return true;

    throw new HttpException('Не авторизован', HttpStatus.UNAUTHORIZED);
  }
}
