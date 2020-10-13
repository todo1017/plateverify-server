import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Vehicle } from './vehicle.entity';
import { VehicleImportDto } from "./dto/vehicle-import.dto";
import { VehicleViewDto } from "./dto/vehicle-view.dto";
import { VehicleUpdateDto } from "./dto/vehicle-update.dto";
import { VehicleRemoveDto } from "./dto/vehicle-remove.dto";
import { VehicleFlagDto } from "./dto/vehicle-flag.dto";
import * as Papa from 'papaparse';
import * as moment from "moment";

@Injectable()
export class VehicleService {

  constructor (
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  protected async checkFlag(vehicle: Vehicle): Promise<Vehicle | null> {
    if (!vehicle) {
      return null;
    }
    const currentDate = moment().subtract(vehicle.school.timezone, 'hours').format('YYYY-MM-DD');
    if (vehicle.flagged && vehicle.flags.length && vehicle.flags[0].expire === currentDate) {
      return await this.unflag(vehicle.id);
    }
    return vehicle;
  }

  public async findById(id: string): Promise<Vehicle | null> {
    return await this.vehicleRepository.findOne({ id });
  }

  public async findByPlateSchool(plate: string, schoolId: string): Promise<Vehicle | null> {
    const vehicle = await this.vehicleRepository.findOne({
      where: {
        plate: plate.toLowerCase(),
        schoolId
      },
      relations: ["member", "school"]
    });
    return await this.checkFlag(vehicle);
  }

  public async paginate(options: IPaginationOptions, schoolId: string): Promise<Pagination<Vehicle>> {
    let queryBuilder = this.vehicleRepository.createQueryBuilder('c')
      .where('c.schoolId = :schoolId', {schoolId})
      .orderBy('c.plate')
      .leftJoinAndSelect("c.member", "member");
    return paginate<Vehicle>(queryBuilder, options);
  }

  public async search(options: IPaginationOptions, keyword: string, schoolId: string): Promise<Pagination<Vehicle>> {
    let queryBuilder = this.vehicleRepository.createQueryBuilder('c')
      .where('c.schoolId = :schoolId', {schoolId})
      .andWhere('c.plate like :keyword', {keyword: `%${keyword.toLowerCase()}%`})
      .andWhere('c.memberId is null')
      .orderBy('c.plate')
      .leftJoinAndSelect("c.member", "member");
    return paginate<Vehicle>(queryBuilder, options);
  }

  public async import(vehicleImportDto: VehicleImportDto, file: any, schoolId: string): Promise<any> {
    const result = Papa.parse(file.buffer.toString(), { header:true, skipEmptyLines:true });
    const failed = [];

    for (const key in result.data) {
      let data = result.data[key];
      try {
        const vehicle = await this.vehicleRepository.create({
          plate : data[vehicleImportDto.plate].toLowerCase(),
          make  : data[vehicleImportDto.make],
          model : data[vehicleImportDto.model],
          body  : data[vehicleImportDto.body],
          color : data[vehicleImportDto.color],
          schoolId
        });
        await this.vehicleRepository.save(vehicle);
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

  public async view(vehicleViewDto: VehicleViewDto): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: {
        id: vehicleViewDto.id,
      },
      relations: ["school", "records", "member"]
    });
    return await this.checkFlag(vehicle);
  }

  public async update(vehicleUpdateDto: VehicleUpdateDto): Promise<Vehicle> {
    let vehicle = await this.vehicleRepository.findOne({
      where: {
        id: vehicleUpdateDto.id,
      },
      relations: ["school", "records", "member"]
    });
    vehicle = {
      ...vehicle,
      ...vehicleUpdateDto
    };
    return await this.vehicleRepository.save(vehicle);
  }

  public async remove(vehicleRemoveDto: VehicleRemoveDto): Promise<DeleteResult> {
    return await this.vehicleRepository.delete(vehicleRemoveDto.id);
  }

  public async flag(vehicleFlagDto: VehicleFlagDto): Promise<Vehicle> {
    let vehicle = await this.vehicleRepository.findOneOrFail({ id: vehicleFlagDto.id });
    if (vehicle.flags.length) {
      vehicle.flags[0].end = moment().format('YYYY-MM-DD');
    }
    const flags = [
      {
        reason: vehicleFlagDto.reason,
        expire: vehicleFlagDto.expire,
        start: moment().format('YYYY-MM-DD')
      },
      ...vehicle.flags
    ]
    vehicle = {
      ...vehicle,
      flagged: true,
      flags
    };
    return await this.vehicleRepository.save(vehicle);
  }

  public async unflag(id: string): Promise<Vehicle> {
    let vehicle = await this.vehicleRepository.findOneOrFail({ id });
    if (vehicle.flags.length) {
      vehicle.flags[0].end = moment().format('YYYY-MM-DD');
    }
    vehicle = {
      ...vehicle,
      flagged: false,
    };
    return await this.vehicleRepository.save(vehicle);
  }

  public async find(keyword: string, schoolId: string): Promise<Vehicle[]> {
    let vehicles = await this.vehicleRepository.createQueryBuilder('c')
      .where('c.schoolId = :schoolId', { schoolId })
      .andWhere('c.memberId is null')
      .andWhere('c.plate like :key', { key: `%${keyword.toLowerCase()}%` })
      .orderBy('c.plate')
      .getMany();
    return vehicles;
  }

  public async connect(id: string, memberId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOneOrFail({ id });
    return await this.vehicleRepository.save({
      ...vehicle,
      memberId
    });
  }

  public async disconnect(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOneOrFail({ id });
    return await this.vehicleRepository.save({
      ...vehicle,
      memberId: null
    });
  }

}
