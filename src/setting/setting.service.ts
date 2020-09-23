import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from './setting.entity';
import { SettingUpdateDto } from "./dto/setting-update.dto";

@Injectable()
export class SettingService {

  constructor (
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  public async find(category: string, schoolId: string): Promise<Setting> {
    return await this.settingRepository.findOne({ where: { category, schoolId } });
  }

  public async update(settingUpdateDto: SettingUpdateDto, schoolId: string): Promise<Setting> {
    return await this.settingRepository.save({
      ...settingUpdateDto,
      schoolId
    });
  }

}
