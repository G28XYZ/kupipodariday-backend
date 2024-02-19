import { IsUrl, Length, Min } from 'class-validator';
import { PrimaryEntityFields } from 'src/common/primary-entity-fields';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

// TODO - перенести числа и текст в константы

/** Схема для подарков (wish) */
@Entity()
export class Wish extends PrimaryEntityFields {
  /** name — название подарка. Не может быть длиннее 250 символов и короче одного. */
  @Column()
  @Length(1, 250)
  name: string;
  /** link — ссылка на интернет-магазин, в котором можно приобрести подарок, строка. */
  @IsUrl()
  link: string;
  /** image ссылка на изображение подарка, строка. Должна быть валидным URL. */
  @Column()
  @IsUrl()
  image: string;
  /** price — стоимость подарка, с округлением до сотых, число. */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Min(1, { message: 'Минимальное значение цены 1 руб' })
  price: number;
  /** raised — сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок. Также округляется до сотых. */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  raised: number;
  /** owner — ссылка на пользователя, который добавил пожелание подарка. */
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
  /** description — строка с описанием подарка длиной от 1 и до 1024 символов. */
  @Column()
  @Length(1, 1024)
  description: string;
  /** offers — массив ссылок на заявки скинуться от других пользователей. */
  @OneToMany(() => Offer, (offer) => offer.item, { cascade: true })
  offers: Offer[];
  /** copied — содержит cчётчик тех, кто скопировал подарок себе. Целое десятичное число. */
  @Column({ default: 0 })
  copied: number;
  /**  */
  @BeforeUpdate()
  private _sumOffers() {
    if (this.offers?.length) {
      this.raised = this.offers.reduce((sum, item) => sum + item.amount, 0);
    }
  }
}
