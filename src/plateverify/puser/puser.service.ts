import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { School } from 'src/entities/school.entity';

@Injectable()
export class PuserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

}
