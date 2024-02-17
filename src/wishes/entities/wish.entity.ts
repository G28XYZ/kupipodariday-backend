import { IsUrl, Length, MaxLength, MinLength } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// TODO - перенести числа и текст в константы

/** Схема для подарков (wish) */
@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;
  /** name — название подарка. Не может быть длиннее 250 символов и короче одного. */
  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;
  /** link — ссылка на интернет-магазин, в котором можно приобрести подарок, строка. */
  @IsUrl()
  link: Wishlist;
  /** image ссылка на изображение подарка, строка. Должна быть валидным URL. */
  @Column()
  @IsUrl()
  image: string;
  /** price — стоимость подарка, с округлением до сотых, число. */
  @Column()
  price: number;
  /** raised — сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок. Также округляется до сотых. */
  @Column()
  raised: number;
  /** owner — ссылка на пользователя, который добавил пожелание подарка. */
  @ManyToOne(() => User, (user) => user.username)
  owner: User;
  /** description — строка с описанием подарка длиной от 1 и до 1024 символов. */
  @Column()
  @Length(1, 1024)
  description: string;
  /** offers — массив ссылок на заявки скинуться от других пользователей. */
  // @OneToMany(() => Offer, (offer) => offer.item)
  // @JoinTable()
  // offers: Offer[];
  /** copied — содержит cчётчик тех, кто скопировал подарок себе. Целое десятичное число. */
  @Column()
  copied: number;
}
