import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PrimaryEntityFields } from 'src/common/primary-entity-fields';
import { BcryptService } from 'src/helpers/bcrypt.service';
import { Offer } from 'src/offers/entities/offer.entity';
import { DEFAULT_VALUES, ERROR_MESSAGES } from 'src/utils/constants';
import { stringFormat } from 'src/utils/string-format';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

// TODO - перенести числа и текст в константы

/** Схема пользователя (user): */
@Entity()
export class User extends PrimaryEntityFields {
  /** имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле. */
  @Column({ unique: true })
  @Length(2, 30, {
    message: JSON.stringify({
      username: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 2, 30),
    }),
  })
  username: string;
  /** about — **информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе». */
  @ValidateIf((s) => Boolean(s?.length))
  @Column({ default: DEFAULT_VALUES.USER.ABOUT })
  @Length(2, 200, {
    message: JSON.stringify({
      about: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 2, 200),
    }),
  })
  @IsOptional()
  about?: string;
  /** avatar — ссылка на аватар. В качестве значения по умолчанию задайте https://i.pravatar.cc/300 */
  @Column({ default: DEFAULT_VALUES.USER.AVATAR })
  @IsUrl(undefined, {
    message: JSON.stringify({
      avatar: stringFormat(ERROR_MESSAGES.VALIDATION.IS_URL, 'для аватар'),
    }),
  })
  @IsOptional()
  avatar?: string;
  /** email — адрес электронной почты пользователя, должен быть уникален. */
  @Column({ unique: true })
  @IsEmail(undefined, {
    message: JSON.stringify({ email: ERROR_MESSAGES.VALIDATION.IS_EMAIL }),
  })
  @IsNotEmpty({
    message: JSON.stringify({ email: ERROR_MESSAGES.VALIDATION.NOT_EMPTY }),
  })
  email: string;
  /** password — пароль пользователя, строка. */
  @Column({ select: false })
  @IsNotEmpty({
    message: JSON.stringify({ password: ERROR_MESSAGES.VALIDATION.NOT_EMPTY }),
  })
  @MinLength(6, {
    message: JSON.stringify({
      password: ERROR_MESSAGES.VALIDATION.MIN_LENGTH_PASS,
    }),
  })
  password: string;
  /** wishes — список желаемых подарков. Используйте для него соответствующий тип связи. */
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];
  /** offers — содержит список подарков, на которые скидывается пользователь. Установите для него подходящий тип связи. */
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
  /** wishlists содержит список вишлистов, которые создал пользователь. Установите для него подходящий тип связи. */
  @ManyToMany(() => Wishlist)
  @JoinTable()
  wishlists: Wishlist[];
  /** хэшировать пароль перед созданием/обновлением в базе */
  @BeforeInsert()
  @BeforeUpdate()
  private async _handleHashPassword() {
    if (this.password) {
      this.password = await new BcryptService().genHashPass(this.password);
    }
  }
}
