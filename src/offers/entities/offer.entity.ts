import { PrimaryEntityFields } from 'src/common/primary-entity-fields';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

/** Схема желающих скинуться (offer): */
@Entity()
export class Offer extends PrimaryEntityFields {
  /** user содержит id желающего скинуться; */
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  /** item содержит ссылку на товар; */
  @ManyToOne(() => Wish, (wish) => wish.name)
  item: Wish;
  /** amount — сумма заявки, округляется до двух знаков после запятой; */
  @Column()
  amount: number;
  /** hidden — флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false. */
  @Column({ default: false })
  hidden: boolean;
}
