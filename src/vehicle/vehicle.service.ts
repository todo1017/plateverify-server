import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Vehicle } from './vehicle.entity';
import { VehicleImportDto } from "./dto/vehicle-import.dto";
import { VehicleViewDto } from "./dto/vehicle-view.dto";
import { VehicleUpdateDto } from "./dto/vehicle-update.dto";
import { VehicleRemoveDto } from "./dto/vehicle-remove.dto";
import * as Papa from 'papaparse';

@Injectable()
export class VehicleService {

  constructor (
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  public async findByPlateSchool(plate: string, schoolId: string): Promise<Vehicle | null> {
    return await this.vehicleRepository.findOne({
      where: {
        plate: plate.toLowerCase(),
        schoolId
      },
      relations: ["member"]
    });
  }

  public async paginate(options: IPaginationOptions, schoolId: string): Promise<Pagination<Vehicle>> {
    return paginate<Vehicle>(this.vehicleRepository, options, {
      relations: ['member'],
      where: {
        schoolId
      }
    });
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
    let vehicle = await this.vehicleRepository.findOne({ id: vehicleViewDto.id });
    return vehicle;
  }

  public async update(vehicleUpdateDto: VehicleUpdateDto): Promise<Vehicle> {
    let vehicle = await this.vehicleRepository.findOne({ id: vehicleUpdateDto.id });
    vehicle = {
      ...vehicle,
      ...vehicleUpdateDto
    };
    return await this.vehicleRepository.save(vehicle);
  }

  public async remove(vehicleRemoveDto: VehicleRemoveDto): Promise<DeleteResult> {
    return await this.vehicleRepository.delete(vehicleRemoveDto.id);
  }

}
