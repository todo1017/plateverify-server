import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import * as moment from 'moment';
import { SchoolService } from 'src/school/school.service';
import { Record } from './record.entity';
import { RecordSearchDto } from './dto/record-search.dto';
import { RecordCreateDto } from "./dto/record-create.dto";

@Injectable()
export class RecordService {

  constructor (
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    private schoolService: SchoolService,
  ) {}

  public async paginate(options: IPaginationOptions, recordSearchDto: RecordSearchDto, schoolId: string): Promise<Pagination<Record>> {
    const school = await this.schoolService.findById(schoolId);
    const startDate = moment(recordSearchDto.startDate, 'YYYY-MM-DD hh:mm:ss').subtract(school.timezone, 'hour').toDate();
    const endDate = moment(recordSearchDto.endDate, 'YYYY-MM-DD hh:mm:ss').subtract(school.timezone, 'hour').toDate();
    return paginate<Record>(this.recordRepository, options, {
      // relations: ['vehicles'],
      where: {
        schoolId,
        created_at: Between(startDate, endDate)
      },
    });
  }

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
