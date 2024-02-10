import { Column } from 'typeorm';

/** Схема желающих скинуться (offer): */
export class Offer {
  /** user содержит id желающего скинуться; */
  @Column()
  user: string;

  /** item содержит ссылку на товар; */
  @Column()
  item: string;

  /** amount — сумма заявки, округляется до двух знаков после запятой; */
  @Column()
  amount: number;

  /** hidden — флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false. */
  @Column({ default: false })
  hidden: boolean;
}
