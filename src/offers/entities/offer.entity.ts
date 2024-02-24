import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { PrimaryEntityFields } from 'src/common/primary-entity-fields';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

/** Схема желающих скинуться (offer): */
@Entity()
export class Offer extends PrimaryEntityFields {
  /** user содержит id желающего скинуться; */
  @ManyToOne(() => User, (user) => user.offers)
  user: User;
  /** item содержит ссылку на товар; */
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
  /** amount — сумма заявки, округляется до двух знаков после запятой; */
  @Column()
  @IsNotEmpty({
    message: JSON.stringify({ amount: ERROR_MESSAGES.VALIDATION.NOT_EMPTY }),
  })
  @IsNumber(undefined, {
    message: JSON.stringify({ amount: ERROR_MESSAGES.VALIDATION.IS_NUMBER }),
  })
  @Min(1, { message: JSON.stringify({ amount: ERROR_MESSAGES.OFFER.MIN }) })
  amount: number;
  /** hidden — флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false. */
  @Column({ default: false })
  hidden: boolean;
}
