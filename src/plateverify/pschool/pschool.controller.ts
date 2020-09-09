import {
  Controller,
  UseGuards,
  HttpStatus,
  Response,
  // Request,
  // Get,
  Post,
  Body,
  // Put,
  // Param,
  // Delete,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from "src/security/role.guard";
import { Roles } from "src/security/roles.decorator";
import { PschoolService } from './pschool.service';
import { SchoolCreateDto } from './dto/school-create.dto';
import { SchoolUpdateDto } from './dto/school-update.dto';
import { SchoolLogoDto } from './dto/school-logo.dto';

@Controller('p/school')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class PschoolController {

  constructor(
    private pschoolService: PschoolService,
  ) {}

  @Post('list')
  @Roles('plateverify', 'admin')
  public async list(@Response() res, @Body() body) {
    const result = await this.pschoolService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('new')
  @Roles('plateverify', 'admin')
  public async new(@Response() res, @Body() schoolCreateDto: SchoolCreateDto) {
    const result = await this.pschoolService.create(schoolCreateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles('plateverify', 'admin')
  public async update(@Response() res, @Body() schoolUpdateDto: SchoolUpdateDto) {
    const result = await this.pschoolService.update(schoolUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('logo')
  @Roles('plateverify', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  public async logo(@Response() res, @Body() body, @UploadedFile() file) {
    const result = await this.pschoolService.uploadLogo({
      id: body.id,
      buffer: file.buffer,
      ext: file.mimetype.split('/')[1]
    });
    return res.status(HttpStatus.OK).json(result);
    return res.status(HttpStatus.OK).json(file);
  }

}
