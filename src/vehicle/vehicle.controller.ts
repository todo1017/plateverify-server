import {
  Controller,
  UseGuards,
  HttpStatus,
  Post,
  Response,
  Body,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL } from "src/constants/role.type";
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle.entity';
import { VehicleListDto } from './dto/vehicle-list.dto';
import { VehicleImportDto } from './dto/vehicle-import.dto';
import { VehicleUpdateDto } from './dto/vehicle-update.dto';
import { VehicleRemoveDto } from './dto/vehicle-remove.dto';
import * as Papa from 'papaparse';

@Controller('vehicle')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class VehicleController {

  constructor(private readonly vehicleService: VehicleService) {}

  @Post('list')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async list(@Response() res, @Body() vehicleListDto: VehicleListDto): Promise<Pagination<Vehicle>> {
    const result = await this.vehicleService.paginate(vehicleListDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('parse')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async parse(@Response() res, @UploadedFile() file) {
    const result = Papa.parse(file.buffer.toString(), {header:true, skipEmptyLines:true});
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('import')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async import(
    @Response() res,
    @UploadedFile() file,
    @Body() vehicleImportDto: VehicleImportDto
  ) {
    const result = Papa.parse(file.buffer.toString(), {header:true, skipEmptyLines:true});
    let failedRows = [];

    for (const key in result.data) {
      let success = this.vehicleService.import(vehicleImportDto, result.data[key]);
      if (!success) {
        failedRows.push(result.data[key]);
      }
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      failedRows
    });
  }

  @Post('update')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async update(@Response() res, @Body() vehicleUpdateDto: VehicleUpdateDto) {
    const result = await this.vehicleService.update(vehicleUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('remove')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async remove(@Response() res, @Body() vehicleRemoveDto: VehicleRemoveDto) {
    const result = await this.vehicleService.update(vehicleRemoveDto);
    return res.status(HttpStatus.OK).json(result);
  }

}