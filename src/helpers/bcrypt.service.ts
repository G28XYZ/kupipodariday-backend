import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

/**
 * сервис для взаимодействия с bcrypt
 */
@Injectable()
export class BcryptService {
  /** сравнить пароль */
  async comparePass(pass: string, hash: string) {
    return await compare(pass, hash);
  }
  /** сгенерировать хэш для пароля */
  async genHashPass(password: string) {
    return await hash(password, await genSalt(10));
  }
}
