import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Vehicle } from './vehicle.entity';
import { VehicleImportDto } from "./dto/vehicle-import.dto";
import { VehicleCreateDto } from "./dto/vehicle-create.dto";
import { VehicleUpdateDto } from "./dto/vehicle-update.dto";

@Injectable()
export class VehicleService {

  constructor (
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  public async paginate(options: IPaginationOptions): Promise<Pagination<Vehicle>> {
    return paginate<Vehicle>(this.vehicleRepository, options);
  }

  public async import(vehicleImportDto: VehicleImportDto, data: any): Promise<boolean> {
    try {
      const member = await this.vehicleRepository.create({
        plate : data[vehicleImportDto.plate],
        make  : data[vehicleImportDto.make],
        model : data[vehicleImportDto.model],
        body  : data[vehicleImportDto.body],
        color : data[vehicleImportDto.color],
      });
      await this.vehicleRepository.save(member);
    } catch (error) {
      return false;
    }
    return true;
  }

  public async create(vehicleCreateDto: VehicleCreateDto): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.create(vehicleCreateDto);
    return await this.vehicleRepository.save(vehicle);
  }

  public async update(vehicleUpdateDto: VehicleUpdateDto): Promise<Vehicle> {
    let vehicle = await this.vehicleRepository.findOne({ id: vehicleUpdateDto.id });
    vehicle = {
      ...vehicle,
      ...vehicleUpdateDto
    };
    return await this.vehicleRepository.save(vehicle);
  }

  public async remove(id: string): Promise<DeleteResult> {
    return await this.vehicleRepository.delete(id);
  }

}