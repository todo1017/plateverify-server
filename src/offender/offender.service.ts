import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Offender } from './offender.entity';
import { OffenderImportDto } from "./dto/offender-import.dto";

@Injectable()
export class OffenderService {
  
  constructor (
    @InjectRepository(Offender)
    private readonly offenderRepository: Repository<Offender>,
  ) {}
 
  public async paginate(options: IPaginationOptions): Promise<Pagination<Offender>> {
    return paginate<Offender>(this.offenderRepository, options);
  }

  public async create(offenderImportDto: OffenderImportDto, data: any): Promise<boolean> {
    try {
      const offender = await this.offenderRepository.create({
        name          : data[offenderImportDto.name],
        address       : data[offenderImportDto.address],
        risk_level    : data[offenderImportDto.risk_level],
        plate         : data[offenderImportDto.plate],
        vehicle_make  : data[offenderImportDto.vehicle_make],
        vehicle_model : data[offenderImportDto.vehicle_model],
        vehicle_color : data[offenderImportDto.vehicle_color],
        vehicle_year  : data[offenderImportDto.vehicle_year],
        vehicle_state : data[offenderImportDto.vehicle_state]
      });
      await this.offenderRepository.save(offender);
    } catch (error) {
      return false;
    }
    return true;
  }

}
