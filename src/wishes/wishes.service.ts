import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

class FactoryModel {
  #value: any;

  async factory<T extends this & Record<string, any>, K extends keyof this>(
    method: K,
    args?: Parameters<T[K]>,
  ) {
    if (method in this) {
      const fn = this[method] as (args: Parameters<T[K]>) => ReturnType<T[K]>;
      if (typeof fn === 'function') {
        this.#value = await fn.bind(this)(...args);
      }
      return Object.assign(this, { value: this.#value as ReturnType<T[K]> });
    }
  }
}

@Injectable()
export class WishesService extends FactoryModel {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {
    super();
  }

  private _genWish(wish: Partial<Wish>) {
    return plainToInstance(Wish, wish);
  }

  saveWish(wish: Partial<Wish>) {
    return this.wishRepository.save(this._genWish(wish));
  }

  create(createWishDto: CreateWishDto) {
    return this.saveWish(createWishDto);
  }

  findLast40() {
    return this.wishRepository.find({ take: 40 });
  }

  findTop20() {
    return this.wishRepository.find({ order: { copied: 'DESC' }, take: 20 });
  }

  findByUserId(id: number) {
    return this.wishRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });
  }

  findOneById(id: number) {
    return this.wishRepository.findOneBy({ id });
  }
  /** поиск по id с возможностью передать опции */
  findOneWithOptions(id: number, options?: FindOneOptions<Wish>) {
    return this.wishRepository.findOne({ where: { id }, ...options });
  }

  async findCopingWish(userId: number, wishId: number) {
    const wish = await this.findOneWithOptions(wishId, {
      relations: ['owner'],
    });
    if (!wish.owner.id) throw new NotFoundException('Подарок не найден');
    if (wish.owner.id === userId)
      throw new BadRequestException('Нельзя скопировать свой подарок');
    ++wish.copied;
    return await this.wishRepository.save(wish);
  }

  // async factory<
  //   K extends keyof Omit<WishesService, 'wishRepository' | 'factory'>,
  // >(method: K, args: Parameters<WishesService[K]>) {
  //   let value = {};
  //   if (method in this) {
  //     const fn: Function = this?.[method].bind(this, ...args);
  //     if (typeof fn === 'function') {
  //       value = await fn();
  //     }
  //     return Object.assign(this, { value }) as typeof this & {
  //       value?: ReturnType<WishesService[K]>;
  //     };
  //   }
  // }
}
