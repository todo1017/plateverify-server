import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { RecordCreateDto } from "./dto/record-create.dto";

@Injectable()
export class RecordService {

  constructor (
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  public async create(recordCreateDto: RecordCreateDto): Promise<boolean> {
    try {
      const record = await this.recordRepository.create(recordCreateDto);
      await this.recordRepository.save(record);
    } catch (error) {
      return false;
    }
    return true;
  }

}
