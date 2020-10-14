import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import * as moment from 'moment';
import { SchoolService } from 'src/school/school.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Record } from './record.entity';
import { RecordSearchDto } from './dto/record-search.dto';
import { RecordCreateDto } from "./dto/record-create.dto";
import { RecordViewDto } from "./dto/record-view.dto";

@Injectable()
export class RecordService {

  constructor (
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    private schoolService: SchoolService,
    private vehicleService: VehicleService,
  ) {}

  public async paginate(options: IPaginationOptions, recordSearchDto: RecordSearchDto, schoolId: string): Promise<Pagination<Record>> {
    const school = await this.schoolService.findById(schoolId);
    const startDate = moment(recordSearchDto.startDate, 'YYYY-MM-DD HH:mm').subtract(school.timezone, 'hour').toDate();
    const endDate = moment(recordSearchDto.endDate, 'YYYY-MM-DD HH:mm').subtract(school.timezone, 'hour').toDate();

    const queryBuilder = this.recordRepository.createQueryBuilder('c')
      .where('c.schoolId = :id', {id: schoolId})
      .andWhere('c.created_at between :startDate and :endDate', {startDate, endDate})
      .orderBy('c.created_at', 'DESC');

    return paginate<Record>(queryBuilder, options);
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

  public async view(recordViewDto: RecordViewDto): Promise<any> {
    const record = await this.recordRepository.findOneOrFail({ id: recordViewDto.id });
    const visitHistory = await this.recordRepository.find({
      schoolId: record.schoolId,
      plate: record.plate
    });
    const vehicle = await this.vehicleService.findByPlateSchool(record.plate, record.schoolId);
    return {
      ...record,
      visitHistory,
      vehicle
    }
  }

  public async stats(schoolId: string): Promise<any> {
    const school = await this.schoolService.findById(schoolId);
    const startDate = moment().subtract(school.timezone, 'hour').startOf('day').add(school.timezone, 'hour');
    const endDate = startDate.clone().add(1, 'day');

    const records = await this.recordRepository.find({
      where: {
        schoolId,
        created_at: Between(startDate.toDate(), endDate.toDate())
      }
    });

    const total = records.length;
    const student = records.filter(record => record.meta.visitorGroup === 'student').length;
    const faculty = records.filter(record => record.meta.visitorGroup === 'faculty').length;
    const unknown = records.filter(record => record.meta.visitorGroup === 'unknown').length;

    return {
      total,
      student,
      faculty,
      unknown
    };
  }

}
