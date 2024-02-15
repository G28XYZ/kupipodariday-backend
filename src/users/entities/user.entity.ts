import { genSalt, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// TODO - перенести числа и текст в константы

/** Схема пользователя (user): */
@Entity()
export class User {
  /** id — уникальный числовой идентификатор. Генерируется автоматически и является первичным ключем каждой из таблиц; */
  @PrimaryGeneratedColumn()
  id: number;

  /** createdAt — дата создания, тип значения Date; */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /** updatedAt — дата изменения, тип значения Date. */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  /** имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле. */
  @Column({
    unique: true,
  })
  @Length(2, 30)
  username: string;

  /** about — **информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе». */
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
  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** password — пароль пользователя, строка. */
  @Column({ select: false })
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  /** wishes — список желаемых подарков. Используйте для него соответствующий тип связи. */
  @OneToMany(() => Wish, (wish) => wish.name)
  wishes: Wish[];

  // /** offers — содержит список подарков, на которые скидывается пользователь. Установите для него подходящий тип связи. */
  @ManyToMany(() => Offer, (offer) => offer.user)
  offers: Offer;

  // /** wishlists содержит список вишлистов, которые создал пользователь. Установите для него подходящий тип связи. */
  @OneToMany(() => Wishlist, (wishlist) => wishlist.name)
  wishlists: Wishlist;
}
