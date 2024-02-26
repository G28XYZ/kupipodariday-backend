import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}
  /**
   * создать модель данных подарка
   * @param wish данные о подарке
   */
  private _genWish(wish: Partial<Wish>) {
    return plainToInstance(Wish, wish);
  }
  /**
   * сохранить данные о подарке
   * @param wish данные о подарке
   */
  saveWish(wish: Partial<Wish>) {
    return this.wishRepository.save(this._genWish(wish));
  }
  /**
   * создать подарок
   * @param createWishDto данные о подарке
   */
  create(createWishDto: CreateWishDto) {
    return this.saveWish(createWishDto);
  }
  /**
   * найти крайние 40 подарков
   */
  findLast40() {
    return this.wishRepository.find({ take: 40 });
  }
  /**
   * найти 10 лучших подарков
   */
  findTop10() {
    return this.wishRepository.find({ order: { copied: 'DESC' }, take: 10 });
  }
  /**
   * поиск подарка по уникальному идентификатору пользователя
   * @param userId уникальный идентификатор пользователя
   */
  findByUserId(userId: number) {
    return this.wishRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
  }
  /**
   * поиск подарка по уникальному идентификатору
   * @param id уникальный идентификатор подарка
   */
  findOneById(id: number) {
    return this.wishRepository.findOneBy({ id });
  }
  /** поиск по id с возможностью передать опции */
  findOneWithOptions(id: number, options?: FindOneOptions<Wish>) {
    return this.wishRepository.findOne({ where: { id }, ...options });
  }
  /**
   * скопировать подарок
   * @param wish данные о подарке
   * @param user данные о пользователе
   */
  async copyWish(wish: Wish, user: User) {
    ++wish.copied;
    await this.saveWish(wish);
    delete wish.id;
    return await this.saveWish({ ...wish, owner: user, copied: 0, raised: 0 });
  }
  /**
   * удалить подарок
   * @param id уникальный идентификатор подарка
   */
  removeById(id: number) {
    return this.wishRepository.delete({ id });
  }
  /**
   * обновить данные о подарке
   * @param id - уникальный идентификатор подарка
   * @param updateWishDto - обновляемые данные о подарке
   */
  updateById(id: number, updateWishDto: UpdateWishDto) {
    this.wishRepository.update({ id }, updateWishDto);
    return {};
  }
}
