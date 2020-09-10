import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Member } from './member.entity';
import { MemberImportDto } from "./dto/import.dto";

@Injectable()
export class MemberService {

  constructor (
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}
 
  public async paginate(options: IPaginationOptions): Promise<Pagination<Member>> {
    return paginate<Member>(this.memberRepository, options);
  }

  public async create(memberImportDto: MemberImportDto, data: any): Promise<boolean> {
    try {
      // const member = await this.memberRepository.create({
      //   first_name   : data[offenderImportDto.name],
      //   last_name    : data[offenderImportDto.address],
      //   address      : data[offenderImportDto.risk_level],
      //   group        : data[offenderImportDto.plate],
      //   email  : data[offenderImportDto.vehicle_make],
      //   phone : data[offenderImportDto.vehicle_model],
      //   grade : data[offenderImportDto.vehicle_color],
      //   graduation  : data[offenderImportDto.vehicle_year],
      //   vehicle_state : data[offenderImportDto.vehicle_state]
      // });
      // await this.offenderRepository.save(offender);
    } catch (error) {
      return false;
    }
    return true;
  }

}
