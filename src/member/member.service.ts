import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Member } from './member.entity';
import { MemberImportDto } from "./dto/member-import.dto";
import { MemberUpdateDto } from "./dto/member-update.dto";
import { MemberRemoveDto } from "./dto/member-remove.dto";
import * as Papa from 'papaparse';

@Injectable()
export class MemberService {

  constructor (
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly vehicleService: VehicleService
  ) {}
 
  public async paginate(options: IPaginationOptions): Promise<Pagination<Member>> {
    return paginate<Member>(this.memberRepository, options);
  }

  public async import(memberImportDto: MemberImportDto, file: any): Promise<any> {
    const result = Papa.parse(file.buffer.toString(), { header:true, skipEmptyLines:true });
    const failedRows = [];

    for (const key in result.data) {
      let data = result.data[key];
      try {
        const member = await this.memberRepository.create({
          group      : data[memberImportDto.group],
          first_name : data[memberImportDto.first_name],
          last_name  : data[memberImportDto.last_name],
          address    : data[memberImportDto.address],
          email      : data[memberImportDto.email],
          phone      : data[memberImportDto.phone],
          grade      : data[memberImportDto.grade],
          graduation : data[memberImportDto.graduation],
        });
        await this.memberRepository.save(member);
      } catch (error) {
        failedRows.push({...data, key});
      }
    }
    
    return {
      success: true,
      failedRows
    };
  }

  public async update(memberUpdateDto: MemberUpdateDto): Promise<Member> {
    let member = await this.memberRepository.findOne({ id: memberUpdateDto.id });
    member = {
      ...member,
      ...memberUpdateDto
    };
    return await this.memberRepository.save(member);
  }

  public async remove(memberRemoveDto: MemberRemoveDto): Promise<DeleteResult> {
    return await this.memberRepository.delete(memberRemoveDto.id);
  }

}
