import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import * as moment from 'moment';
import { SchoolService } from 'src/school/school.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Record } from 'src/record/record.entity';
import { AlertSearchDto } from './dto/alert-search.dto';
import { AlertViewDto } from "./dto/alert-view.dto";

@Injectable()
export class AlertService {

  constructor (
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    private schoolService: SchoolService,
    private vehicleService: VehicleService,
  ) {}

  public async paginate(options: IPaginationOptions, alertSearchDto: AlertSearchDto, schoolId: string): Promise<Pagination<Record>> {
    const school = await this.schoolService.findById(schoolId);
    const startDate = moment(alertSearchDto.startDate, 'YYYY-MM-DD HH:mm').subtract(school.timezone, 'hour').toDate();
    const endDate = moment(alertSearchDto.endDate, 'YYYY-MM-DD HH:mm').subtract(school.timezone, 'hour').toDate();

    const queryBuilder = this.recordRepository.createQueryBuilder('c')
      .where('c.schoolId = :id', {id: schoolId})
      .andWhere('c.alert = :alert', {alert: alertSearchDto.status})
      .andWhere('c.created_at between :startDate and :endDate', {startDate, endDate})
      .orderBy('c.created_at', 'DESC');

    return paginate<Record>(queryBuilder, options);
  }

  public async view(alertViewDto: AlertViewDto): Promise<any> {
    const record = await this.recordRepository.findOneOrFail({ id: alertViewDto.id });
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

  public async check(id: string): Promise<any> {
    const record = await this.recordRepository.findOneOrFail({ id });
    return await this.recordRepository.save({
      ...record,
      alert: 'checked'
    })
  }

}