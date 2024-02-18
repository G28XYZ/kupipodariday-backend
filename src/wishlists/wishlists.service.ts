import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    console.log(createWishlistDto);
    const items: Wish[] = [];
    createWishlistDto.itemsId.map(async (id) =>
      items.push(await this.wishRepository.findOneBy({ id })),
    );
    const wishlist = await this.wishlistRepository.save({
      ...createWishlistDto,
      items,
    });

    return wishlist;
  }

  findAll() {
    return this.wishlistRepository.find();
  }

  findOneById(id: number) {
    return this.wishlistRepository.findOneBy({ id });
  }

  update(id: number) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
