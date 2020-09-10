import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Member } from './member.entity';
import { MemberImportDto } from "./dto/member-import.dto";
import { MemberCreateDto } from "./dto/member-create.dto";
import { MemberUpdateDto } from "./dto/member-update.dto";

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

  public async import(memberImportDto: MemberImportDto, data: any): Promise<boolean> {
    try {
      const member = await this.memberRepository.create({
        first_name : data[memberImportDto.first_name],
        last_name  : data[memberImportDto.last_name],
        address    : data[memberImportDto.address],
        group      : data[memberImportDto.group],
        email      : data[memberImportDto.email],
        phone      : data[memberImportDto.phone],
        grade      : data[memberImportDto.grade],
        graduation : data[memberImportDto.graduation],
      });
      await this.memberRepository.save(member);
    } catch (error) {
      return false;
    }
    return true;
  }

  public async create(memberCreateDto: MemberCreateDto): Promise<Member> {
    let member = await this.memberRepository.create(memberCreateDto);
    // member = await this.memberRepository.save(member);

    // for (const key in memberCreateDto.old_vehicles) {
    //   let id = memberCreateDto.old_vehicles[key];
    //   this.vehicleService.update({
    //     id,
    //     member: member.id
    //   })
      
    // }

    return member;

    
  }

  public async update(memberUpdateDto: MemberUpdateDto): Promise<Member> {
    let member = await this.memberRepository.findOne({ id: memberUpdateDto.id });
    member = {
      ...member,
      ...memberUpdateDto
    };
    return await this.memberRepository.save(member);
  }

  public async remove(id: string): Promise<DeleteResult> {
    return await this.memberRepository.delete(id);
  }

}
