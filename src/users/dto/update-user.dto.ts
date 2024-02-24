import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { stringFormat } from 'src/utils/string-format';
import { ERROR_MESSAGES } from 'src/utils/constants';

export class UpdateUserDto extends PartialType(User) {
  @Length(2, 30, {
    message: JSON.stringify({
      username: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 2, 30),
    }),
  })
  @IsOptional()
  username: string;
  /** about — **информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе». */
  @Length(2, 200, {
    message: JSON.stringify({
      about: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 2, 200),
    }),
  })
  @IsOptional()
  about?: string;
  /** avatar — ссылка на аватар. В качестве значения по умолчанию задайте https://i.pravatar.cc/300 */
  @IsUrl(undefined, {
    message: JSON.stringify({
      avatar: stringFormat(ERROR_MESSAGES.VALIDATION.IS_URL, 'для автар'),
    }),
  })
  @IsOptional()
  avatar?: string;
  /** email — адрес электронной почты пользователя, должен быть уникален. */
  @IsEmail(undefined, {
    message: JSON.stringify({ email: ERROR_MESSAGES.VALIDATION.IS_EMAIL }),
  })
  @IsOptional()
  email: string;
  /** password — пароль пользователя, строка. */
  @IsNotEmpty({
    message: JSON.stringify({ password: ERROR_MESSAGES.VALIDATION.NOT_EMPTY }),
  })
  @IsOptional()
  password: string;
}
