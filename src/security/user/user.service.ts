import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserCreateDto } from './dto/create.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  public async findByEmail(userEmail: string): Promise<User | null> {
    return await this.usersRepository.findOne({ email: userEmail });
  }

  public async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneOrFail(id);
  }

  public async create(userCreateDto: UserCreateDto): Promise<User> {
    let user = await this.usersRepository.findOne({ email: userCreateDto.email });
    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.usersRepository.create(userCreateDto);
    return await this.usersRepository.save(user);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  // public async update(
  //   id: number,
  //   newValue: UserDto,
  // ): Promise<User | null> {
  //   const user = await this.usersRepository.findOneOrFail(id);
  //   if (!user.id) {
  //     console.error("user doesn't exist");
  //     return user;
  //   }
  //   await this.usersRepository.update(id, newValue);
  //   return await this.usersRepository.findOne(id);
  // }

}
