import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, DeleteResult } from 'typeorm';
import slugify from "slugify";
import { S3 } from 'aws-sdk';
import { School } from './school.entity';
import { SchoolCreateDto } from "./dto/school-create.dto";
import { SchoolUpdateDto } from "./dto/school-update.dto";
import { SchoolLogoDto } from "./dto/school-logo.dto";

@Injectable()
export class SchoolService {
  
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    private readonly configService: ConfigService
  ) {}

  public async findAll(): Promise<School[]> {
    return await this.schoolRepository.find();
  }

  public async findById(id: string): Promise<School | null> {
    return await this.schoolRepository.findOneOrFail(id);
  }

  public async create(schoolCreateDto: SchoolCreateDto): Promise<School> {
    const school = await this.schoolRepository.create({
      ...schoolCreateDto,
      logo: '',
      slug: slugify(schoolCreateDto.name)
    });
    return await this.schoolRepository.save(school);
  }

  public async update(schoolUpdateDto: SchoolUpdateDto): Promise<School> {

    let school = await this.schoolRepository.findOneOrFail(schoolUpdateDto.id);

    school = {
      ...school,
      ...schoolUpdateDto,
      slug: slugify(schoolUpdateDto.name)
    }

    return await this.schoolRepository.save(school);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.schoolRepository.delete(id);
  }

  public async uploadLogo(schoolLogoDto: SchoolLogoDto): Promise<School> {

    let school = await this.schoolRepository.findOneOrFail(schoolLogoDto.id);
    
    const s3 = new S3();
    const result = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: schoolLogoDto.buffer,
      Key: `logo-${school.slug}.${schoolLogoDto.ext}`
    }).promise();

    school = {
      ...school,
      logo: result.Location
    };

    return await this.schoolRepository.save(school);
  }


}
