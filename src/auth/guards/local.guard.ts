import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NAME_LOCAL_AUTH_GUARD } from 'src/utils/constants';

@Injectable()
export class LocalAuthGuard extends AuthGuard(NAME_LOCAL_AUTH_GUARD) {}
