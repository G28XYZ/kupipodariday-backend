import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @Length(2, 30)
  @IsOptional()
  username: string;
  /** about — **информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе». */
  @Length(2, 200)
  @IsOptional()
  about?: string;
  /** avatar — ссылка на аватар. В качестве значения по умолчанию задайте https://i.pravatar.cc/300 */
  @IsUrl()
  @IsOptional()
  avatar?: string;
  /** email — адрес электронной почты пользователя, должен быть уникален. */
  @IsEmail()
  @IsOptional()
  email: string;
  /** password — пароль пользователя, строка. */
  @IsNotEmpty()
  @IsOptional()
  password: string;
}
