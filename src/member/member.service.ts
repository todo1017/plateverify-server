import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Member } from './member.entity';
import { MemberImportDto } from "./dto/member-import.dto";
import { MemberViewDto } from './dto/member-view.dto';
import { MemberUpdateDto } from "./dto/member-update.dto";
import { MemberRemoveDto } from "./dto/member-remove.dto";
import * as Papa from 'papaparse';

@Injectable()
export class MemberService {

  constructor (
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  public async paginate(options: IPaginationOptions, group: string, schoolId: string): Promise<Pagination<Member>> {
    let queryBuilder = this.memberRepository.createQueryBuilder('c')
      .where('c.schoolId = :schoolId', {schoolId})
      .orderBy('c.first_name')
      .leftJoinAndSelect("c.vehicles", "vehicle");
    if (group !== 'all') {
      queryBuilder = queryBuilder.where('c.group = :group', {group});
    }
    return paginate<Member>(queryBuilder, options);
  }

  public async import(memberImportDto: MemberImportDto, file: any, schoolId: string): Promise<any> {
    const result = Papa.parse(file.buffer.toString(), { header:true, skipEmptyLines:true });
    const failed = [];

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
          schoolId
        });
        await this.memberRepository.save(member);
      } catch (error) {
        failed.push({
          ...data,
          key,
          error: {
            message: error.message
          }
        });
      }
    }

    return { failed };
  }

  public async view(memberViewDto: MemberViewDto): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberViewDto.id,
      },
      relations: ['vehicles'],
    });
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

  public async remove(memberRemoveDto: MemberRemoveDto): Promise<DeleteResult> {
    return await this.memberRepository.delete(memberRemoveDto.id);
  }

  public async create(data: any): Promise<Member> {
    const member = await this.memberRepository.create({
      schoolId: data.schoolId,
      first_name: data.first_name,
      last_name: data.last_name,
      address: data.address,
      group: data.group,
      email: data.email,
      phone: data.phone,
      grade: data.grade,
      graduation: data.graduation,
      tag: data.tag
    });
    return await this.memberRepository.save(member);
  }

}
