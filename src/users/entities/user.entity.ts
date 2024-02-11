import { IsEmail, IsNotEmpty, IsUrl, Length, MinLength } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

// TODO - перенести числа и текст в константы

/** Схема пользователя (user): */
@Entity()
export class User {
  /** id — уникальный числовой идентификатор. Генерируется автоматически и является первичным ключем каждой из таблиц; */
  @PrimaryGeneratedColumn()
  id: number;

  /** createdAt — дата создания, тип значения Date; */
  @Column()
  createdAt: Date;

  /** updatedAt — дата изменения, тип значения Date. */
  @Column()
  updatedAt: Date;

  /** имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле. */
  @Column({
    unique: true,
  })
  @Length(2, 30)
  username: string;

  /** about — **информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе». */
  @Column()
  @Length(2, 200)
  about?: string;

  /** avatar — ссылка на аватар. В качестве значения по умолчанию задайте https://i.pravatar.cc/300 */
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar?: string;

  /** email — адрес электронной почты пользователя, должен быть уникален. */
  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** password — пароль пользователя, строка. */
  @Column()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  /** wishes — список желаемых подарков. Используйте для него соответствующий тип связи. */
  @JoinColumn()
  wishes: Wish;

  /** offers — содержит список подарков, на которые скидывается пользователь. Установите для него подходящий тип связи. */
  @JoinColumn()
  offers: Offer;

  /** wishlists содержит список вишлистов, которые создал пользователь. Установите для него подходящий тип связи. */
  @JoinColumn()
  wishlist: Wishlist;
}
