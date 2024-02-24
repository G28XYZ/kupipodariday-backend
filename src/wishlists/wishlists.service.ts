import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}
  /**
   * создать коллекцию подарков
   * @param createWishlistDto - данные о новой коллекции подарков
   */
  async create(createWishlistDto: CreateWishlistDto) {
    return await this.wishlistRepository.save(createWishlistDto);
  }
  /**
   * поиск всех коллекций подарков
   */
  findAll() {
    return this.wishlistRepository.find();
  }
  /**
   * поиск коллекции подарков по уникальному идентификатору
   * @param id - уникальный идентификатор коллекции
   */
  findOneById(id: number) {
    return this.wishlistRepository.findOneBy({ id });
  }
  /**
   * обновление коллекции подарков
   * @param id - уникальный идентификатор коллекции
   * @param updateWishlistDto - обновленные данные о коллекции
   */
  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistRepository.update({ id }, updateWishlistDto);
  }
  /**
   * удаление коллекции подарков
   * @param id уникальный идентификатор коллекции
   */
  delete(id: number) {
    return this.wishlistRepository.delete({ id });
  }
}
