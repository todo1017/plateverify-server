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
import * as Papa from 'papaparse';
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { ROLE_SCOPE_PLATEVERIFY } from "src/constants/role.type";
import { DataMigrationService } from './data-migration.service';

@Controller('data-migration')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class DataMigrationController {

  constructor(
    private readonly migrationService: DataMigrationService
  ) {}

  @Post('parse')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  @UseInterceptors(FileInterceptor('file'))
  public async parse(@Response() res, @UploadedFile() file) {
    const result = Papa.parse(file.buffer.toString(), { header:true, skipEmptyLines:true });
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('get_status')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  public async get_status(@Response() res) {
    try {
      const result = await this.migrationService.getStatus();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

  @Post('run_migrate')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  @UseInterceptors(FileInterceptor('file'))
  public async run_migrate(@Response() res, @UploadedFile() file, @Body() body) {
    try {
      const result = Papa.parse(file.buffer.toString(), { header:true, skipEmptyLines:true });
      await this.migrationService.migrate(result.data, body.step);
      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

}