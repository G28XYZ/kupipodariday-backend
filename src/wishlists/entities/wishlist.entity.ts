import { IsOptional, IsUrl, Length, MaxLength } from 'class-validator';
import { PrimaryEntityFields } from 'src/common/primary-entity-fields';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { stringFormat } from 'src/utils/string-format';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, OneToMany } from 'typeorm';

/** Cхема списка подарков (wishlist): */
@Entity()
export class Wishlist extends PrimaryEntityFields {
  /** name — название списка. Не может быть длиннее 250 символов и короче одного; */
  @Column()
  @Length(1, 250, {
    message: JSON.stringify({
      name: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 1, 250),
    }),
  })
  name: string;
  /** description — описание подборки, строка до 1500 символов; */
  @Column({ default: '' })
  @MaxLength(1500)
  @IsOptional()
  description: string;
  /** image — обложка для подборки; */
  @Column()
  @IsUrl(undefined, {
    message: JSON.stringify({
      image: stringFormat(ERROR_MESSAGES.VALIDATION.IS_URL, 'для картинки'),
    }),
  })
  image: string;
  /** items содержит набор ссылок на подарки. */
  @OneToMany(() => Wish, (wish) => wish.owner)
  items: Wish[];
}
