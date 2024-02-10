import { IsUrl, MaxLength, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';

// TODO - перенести числа и текст в константы

/** Схема для подарков (wish) */
@Entity()
export class Wish {
  /** name — название подарка. Не может быть длиннее 250 символов и короче одного. */
  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  /** link — ссылка на интернет-магазин, в котором можно приобрести подарок, строка. */
  @Column()
  @IsUrl()
  link: string;

  /** image ссылка на изображение подарка, строка. Должна быть валидным URL. */
  @Column()
  image: string;

  /** price — стоимость подарка, с округлением до сотых, число. */
  @Column()
  price: number;

  /** raised — сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок. Также округляется до сотых. */
  @Column()
  raised: number;

  /** owner — ссылка на пользователя, который добавил пожелание подарка. */
  @Column()
  owner: string;

  /** description — строка с описанием подарка длиной от 1 и до 1024 символов. */
  @Column()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  /** offers — массив ссылок на заявки скинуться от других пользователей. */
  @Column()
  @IsUrl()
  offers: string[];

  /** copied — содержит cчётчик тех, кто скопировал подарок себе. Целое десятичное число. */
  @Column()
  copied: number;
}
