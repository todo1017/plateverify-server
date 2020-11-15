import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DataMigration } from './data-migration.entity';

@Injectable()
export class DataMigrationService {

  constructor (
    @InjectRepository(DataMigration) private readonly dataMigrationRepository: Repository<DataMigration>,
    @InjectQueue('data-migration') private dataMigrationQueue: Queue,
  ) {}

  public async getStatus() {
    return await this.dataMigrationRepository.find({
      where: { category: 'status' }
    });
  }

  public async getValue(category, key) {
    const record = await this.dataMigrationRepository.findOne({
      where: { category, key }
    });
    return record ? record.value : null;
  }

  public async getValues(category, key) {
    const records = await this.dataMigrationRepository.find({
      where: { category, key }
    });
    if (records) {
      return records.map(r => r.value);
    }
    return [];
  }

  public async updateStatus(key, value) {
    const status = await this.dataMigrationRepository.findOne({
      where: {
        category: 'status',
        key
      }
    });
    if (status) {
      status.value = value;
      await this.dataMigrationRepository.save(status);
    } else {
      const record = await this.dataMigrationRepository.create({
        category: 'status',
        key,
        value
      });
      await this.dataMigrationRepository.save(record);
    }
  }

  public async create(data: any) {
    const record = await this.dataMigrationRepository.create(data);
    return await this.dataMigrationRepository.save(record);
  }

  public async migrate(records: any, step: string) {
    this.dataMigrationQueue.add(step, { records });
  }

}