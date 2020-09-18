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
import { ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL } from "src/constants/role.type";
import { OffenderService } from './offender.service';
import { Offender } from './offender.entity';
import { OffenderSearchDto } from './dto/offender-search.dto';
import { OffenderImportDto } from './dto/offender-import.dto';
import * as Papa from 'papaparse';

@Controller('offender')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class OffenderController {

  constructor(private readonly offenderService: OffenderService) {}

  @Post('search')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  public async index(@Response() res, @Body() offenderSearchDto: OffenderSearchDto): Promise<Pagination<Offender>> {
    const result = await this.offenderService.paginate(offenderSearchDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('parse')
  @Roles(ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async parse(@Response() res, @UploadedFile() file) {
    const result = Papa.parse(file.buffer.toString(), {header:true, skipEmptyLines:true});

    if (!result) {
      return res.status(HttpStatus.BAD_REQUEST).json({});
    }
    
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('import')
  @Roles(ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async import(
    @Response() res,
    @UploadedFile() file,
    @Body() offenderImportDto: OffenderImportDto
  ) {

    const result = Papa.parse(file.buffer.toString(), {header:true, skipEmptyLines:true});
    if (!result) {
      return res.status(HttpStatus.BAD_REQUEST).json({});
    }
    
    let failedRows = [];
    for (const key in result.data) {
      let success = this.offenderService.create(offenderImportDto, result.data[key]);
      if (!success) {
        failedRows.push(result.data[key]);
      }
    }

    return res.status(HttpStatus.OK).json({
      failedRows
    });
  }

}
