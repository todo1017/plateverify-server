import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from './setting.entity';
import { SettingStartDto } from "./dto/setting-start.dto";
import { SettingUpdateDto } from "./dto/setting-update.dto";

@Injectable()
export class SettingService {

  constructor (
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  public async start(settingStartDto: SettingStartDto, schoolId: string): Promise<Setting> {
    const setting = await this.settingRepository.create({
      ...settingStartDto,
      body: [],
      schoolId
    });
    await this.settingRepository.save(setting);
    return setting;
  }

  public async find(schoolId: string): Promise<Setting[]> {
    return await this.settingRepository.find({ where: { schoolId } });
  }

  public async findByCategory(schoolId: string, category: string): Promise<Setting | null> {
    return await this.settingRepository.findOne({
      where: { schoolId, category }
    });
  }

  public async update(settingUpdateDto: SettingUpdateDto, schoolId: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({
      where: { schoolId }
    });
    return await this.settingRepository.save({
      ...settingUpdateDto,
      schoolId,
      id: setting.id
    });
  }

}
