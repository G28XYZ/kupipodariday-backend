import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// TODO - перенести числа и текст в константы

/** Cхема списка подарков (wishlist): */
@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;
  /** name — название списка. Не может быть длиннее 250 символов и короче одного; */
  @Column()
  name: string;

  /** description — описание подборки, строка до 1500 символов; */
  @Column()
  @MinLength(1)
  @MaxLength(1500)
  description: string;

  /** image — обложка для подборки; */
  @Column()
  image: string;

  /** items содержит набор ссылок на подарки. */
  // @Column()
  // items: string[];
}
