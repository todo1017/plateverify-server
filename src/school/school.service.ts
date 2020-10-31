import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, DeleteResult } from 'typeorm';
import slugify from "slugify";
import { S3 } from 'aws-sdk';
import { School } from './school.entity';
import { SchoolCreateDto } from "./dto/school-create.dto";
import { SchoolUpdateDto } from "./dto/school-update.dto";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SchoolService {
  
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    private readonly configService: ConfigService
  ) {}

  public async findAll(): Promise<School[]> {
    return await this.schoolRepository.find({
      order: {
        name: "ASC",
      }
    });
  }

  public async findById(id: string): Promise<School | null> {
    return await this.schoolRepository.findOneOrFail(id);
  }

  public async findBySlug(slug: string): Promise<School | null> {
    return await this.schoolRepository.findOneOrFail({ where: { slug }});
  }

  public async create(schoolCreateDto: SchoolCreateDto): Promise<School> {
    const school = await this.schoolRepository.create({
      ...schoolCreateDto,
      logo: '',
      slug: slugify(schoolCreateDto.name, { replacement: '_', lower: true })
    });
    return await this.schoolRepository.save(school);
  }

  public async update(schoolUpdateDto: SchoolUpdateDto): Promise<School> {
    const { id, name, logo } = schoolUpdateDto;
    const school = await this.schoolRepository.findOneOrFail(id);
    const updated = {
      ...schoolUpdateDto,
      slug: slugify(name, { replacement: '_', lower: true }),
      logo: logo? logo : school.logo
    };
    return await this.schoolRepository.save(updated);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.schoolRepository.delete(id);
  }

  public async uploadLogo(id:string, buffer:any, ext:string): Promise<any> {

    let school = await this.schoolRepository.findOneOrFail(id);
    
    const s3 = new S3();
    const result = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: buffer,
      Key: `logo-${school.slug}-${uuidv4()}.${ext}`
    }).promise();

    school.logo = result.Location;

    return await this.schoolRepository.save(school);
  }

  public async updateCameras(id:string, cameras:any): Promise<School> {
    let school = await this.schoolRepository.findOneOrFail(id);
    school.cameras = cameras;
    return await this.schoolRepository.save(school);
  }

  public async updateGeneral(id:string, name:string, live:string, timezone:number): Promise<School> {
    let school = await this.schoolRepository.findOneOrFail(id);
    school.name = name;
    school.live = live;
    school.timezone = timezone;
    return await this.schoolRepository.save(school);
  }

}
