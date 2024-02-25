import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class BcryptService {
  async comparePass(pass: string, hash: string) {
    return await compare(pass, hash);
  }
}
