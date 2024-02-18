import { IsOptional, IsUrl, Length, MaxLength } from 'class-validator';
import { PrimaryEntityFields } from 'src/common/primary-entity-fields';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, OneToMany } from 'typeorm';

// TODO - перенести числа и текст в константы

/** Cхема списка подарков (wishlist): */
@Entity()
export class Wishlist extends PrimaryEntityFields {
  /** name — название списка. Не может быть длиннее 250 символов и короче одного; */
  @Column()
  @Length(1, 250)
  name: string;
  /** description — описание подборки, строка до 1500 символов; */
  @Column({ default: '' })
  @MaxLength(1500)
  @IsOptional()
  description: string;
  /** image — обложка для подборки; */
  @Column()
  @IsUrl()
  image: string;
  /** items содержит набор ссылок на подарки. */
  @OneToMany(() => Wish, (wish) => wish.owner)
  items: Wish[];
}
