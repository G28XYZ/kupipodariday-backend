import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private _genUser(user: Partial<User>) {
    return plainToInstance(User, user);
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.saveUser(createUserDto);
  }

  findUsersByQuerySearch(searchText: string) {
    searchText = '%' + searchText + '%';
    return this.userRepository.find({
      where: [{ username: Like(searchText) }, { email: Like(searchText) }],
      order: { createdAt: 'ASC' },
    });
  }

  saveUser(user: Partial<User>) {
    return this.userRepository.save(this._genUser(user));
  }

  async addWishlist(userId: number, wishlist: Wishlist) {
    const user = await this.findWishlists(userId);
    user.wishlists.push(wishlist);
    return this.userRepository.save(user);
  }

  findOneWithSelect(username: string, select: (keyof User)[] = []) {
    return this.userRepository.findOne({ where: { username }, select });
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, this._genUser(updateUserDto));
  }

  removeOne(id: number) {
    return this.userRepository.delete({ id });
  }

  findWishes(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
  }

  findWishlists(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['wishlists'],
    });
  }

  async copyWish(userId: number, wish: Wish) {
    const user = await this.findWishes(userId);
    user.wishes.push(wish);
    return this.userRepository.save(user);
  }
}
