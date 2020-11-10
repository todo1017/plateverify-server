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
import * as Papa from 'papaparse';
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL } from "src/constants/role.type";
import { DataMigrationService } from './data-migration.service';
import { SchoolService } from 'src/school/school.service';


@Controller('data-migration')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class DataMigrationController {

  constructor(
    private readonly migrationService: DataMigrationService,
    private readonly schoolService: SchoolService,
  ) {}

  @Post('parse')
  @Roles(ROLE_SCOPE_SCHOOL)
  @UseInterceptors(FileInterceptor('file'))
  public async parse(@Response() res, @UploadedFile() file) {
    const result = Papa.parse(file.buffer.toString(), { header:true, skipEmptyLines:true });
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('enable')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async enable(@Response() res) {
    try {
      await this.migrationService.enable();
      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

  @Post('school_setup')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async school_setup(@Response() res, @Body() body) {
    try {
      const school = await this.schoolService.create(body);
      await this.migrationService.create({
        category: 'school_id',
        key: body.id,
        value: school.id
      });
      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

}