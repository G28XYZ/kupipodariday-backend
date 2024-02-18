import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

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
    return this.userRepository
      .createQueryBuilder('User')
      .where('User.username like :name', { name: searchText })
      .orWhere('User.email like :email', { email: searchText })
      .orderBy('User.id', 'ASC')
      .getMany();
  }

  async saveUser(user: Partial<User>) {
    const u = await this.userRepository.save(this._genUser(user));
    console.log(u);
    return u;
  }

  findOne(username: string, select: (keyof User)[] = []) {
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
}
