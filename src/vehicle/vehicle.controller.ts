import {
  Controller,
  UseGuards,
  HttpStatus,
  Post,
  Response,
  Request,
  Body,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { ROLE_SCOPE_SCHOOL } from "src/constants/role.type";
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle.entity';
import { VehicleListDto } from './dto/vehicle-list.dto';
import { VehicleSearchDto } from './dto/vehicle-search.dto';
import { VehicleImportDto } from './dto/vehicle-import.dto';
import { VehicleViewDto } from './dto/vehicle-view.dto';
import { VehicleUpdateDto } from './dto/vehicle-update.dto';
import { VehicleRemoveDto } from './dto/vehicle-remove.dto';
import { VehicleFlagDto } from './dto/vehicle-flag.dto';
import * as Papa from 'papaparse';

@Controller('vehicle')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class VehicleController {

  constructor(private readonly vehicleService: VehicleService) {}

  @Post('list')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async list(
    @Response() res,
    @Request() req,
    @Body() vehicleListDto: VehicleListDto
  ): Promise<Pagination<Vehicle>> {
    const result = await this.vehicleService.paginate(vehicleListDto, req.user.schoolId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('keyword_search')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async keyword_search(
    @Response() res,
    @Request() req,
    @Body() vehicleSearchDto: VehicleSearchDto
  ): Promise<Pagination<Vehicle>> {
    const result = await this.vehicleService.keyword_search(vehicleSearchDto.keyword, req.user.schoolId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('parse')
  @Roles(ROLE_SCOPE_SCHOOL)
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
  @Roles(ROLE_SCOPE_SCHOOL)
  @UseInterceptors(FileInterceptor('file'))
  public async import(
    @Response() res,
    @Request() req,
    @UploadedFile() file,
    @Body() vehicleImportDto: VehicleImportDto
  ) {
    const result = await this.vehicleService.import(vehicleImportDto, file, req.user.schoolId);
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('view')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async view(@Response() res, @Body() vehicleViewDto: VehicleViewDto) {
    const result = await this.vehicleService.view(vehicleViewDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async update(@Response() res, @Body() vehicleUpdateDto: VehicleUpdateDto) {
    const result = await this.vehicleService.update(vehicleUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('remove')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async remove(@Response() res, @Body() vehicleRemoveDto: VehicleRemoveDto) {
    const result = await this.vehicleService.update(vehicleRemoveDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('flag')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async flag(@Response() res, @Body() vehicleFlagDto: VehicleFlagDto) {
    try {
      const result = await this.vehicleService.flag(vehicleFlagDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

  @Post('unflag')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async unflag(@Response() res, @Body() vehicleViewDto: VehicleViewDto) {
    try {
      const result = await this.vehicleService.unflag(vehicleViewDto.id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

}