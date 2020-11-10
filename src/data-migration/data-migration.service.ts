import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataMigration } from './data-migration.entity';
import { School } from 'src/school/school.entity';

@Injectable()
export class DataMigrationService {

  constructor (
    @InjectRepository(DataMigration)
    private readonly dataMigrationRepository: Repository<DataMigration>
  ) {}

  public async enable() {
    const steps = [
      { category: 'status', key: 'school',   value: 'none' },
      { category: 'status', key: 'camera',   value: 'none' },
      { category: 'status', key: 'setting',  value: 'none' },
      { category: 'status', key: 'offender', value: 'none' },
      { category: 'status', key: 'member',   value: 'none' },
      { category: 'status', key: 'vehicle',  value: 'none' },
      { category: 'status', key: 'record',   value: 'none' },
      { category: 'status', key: 'user',     value: 'none' }
    ];
    for (let i = 0; i < steps.length; i++) {
      await this.dataMigrationRepository.create(steps[i]);
    }
  }

  public async create(data: any) {
    await this.dataMigrationRepository.create(data);
  }

}