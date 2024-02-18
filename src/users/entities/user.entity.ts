import { genSalt, hash } from 'bcrypt';
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
import { Offer } from 'src/offers/entities/offer.entity';
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
  @Length(2, 30)
  username: string;
  /** about — **информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе». */
  @ValidateIf((s) => Boolean(s?.length))
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  @IsOptional()
  about?: string;
  /** avatar — ссылка на аватар. В качестве значения по умолчанию задайте https://i.pravatar.cc/300 */
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar?: string;
  /** email — адрес электронной почты пользователя, должен быть уникален. */
  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  /** password — пароль пользователя, строка. */
  @Column({ select: false })
  @IsNotEmpty()
  @MinLength(5)
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
      this.password = await hash(this.password, await genSalt(10));
    }
  }
}
