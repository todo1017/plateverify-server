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
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle.entity';
import { VehicleSearchDto } from './dto/vehicle-search.dto';
import { VehicleImportDto } from './dto/vehicle-import.dto';
import { VehicleCreateDto } from './dto/vehicle-create.dto';
import { VehicleUpdateDto } from './dto/vehicle-update.dto';
import * as Papa from 'papaparse';

@Controller('vehicle')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class VehicleController {

  constructor(private readonly vehicleService: VehicleService) {}

  @Post('search')
  @Roles('school', 'admin')
  public async search(@Response() res, @Body() vehicleSearchDto: VehicleSearchDto): Promise<Pagination<Vehicle>> {
    const result = await this.vehicleService.paginate(vehicleSearchDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('parse')
  @Roles('school', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  public async parse(@Response() res, @UploadedFile() file) {
    if (file.mimetype !== 'text/csv') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Not CSV file'
      });
    }

    const result = Papa.parse(file.buffer.toString(), {header:true, skipEmptyLines:true});

    return res.status(HttpStatus.OK).json({
      success: true,
      result: {
        data: result.data,
        fields: result.meta.fields
      }
    });
  }

  @Post('import')
  @Roles('school', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  public async import(
    @Response() res,
    @UploadedFile() file,
    @Body() vehicleImportDto: VehicleImportDto
  ) {

    if (file.mimetype !== 'text/csv') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Not CSV file'
      });
    }

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

  @Post('new')
  @Roles('school', 'admin')
  public async new(@Response() res, @Body() vehicleCreateDto: VehicleCreateDto) {
    const result = await this.vehicleService.create(vehicleCreateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles('school', 'admin')
  public async update(@Response() res, @Body() vehicleUpdateDto: VehicleUpdateDto) {
    const result = await this.vehicleService.update(vehicleUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

}