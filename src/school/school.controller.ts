import {
  Controller,
  UseGuards,
  HttpStatus,
  Response,
  Post,
  Body,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { SchoolService } from './school.service';
import { SchoolCreateDto } from './dto/school-create.dto';
import { SchoolUpdateDto } from './dto/school-update.dto';
import { SchoolLogoDto } from './dto/school-logo.dto';

@Controller('school')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class SchoolController {

  constructor(
    private schoolService: SchoolService,
  ) {}

  @Post('list')
  @Roles('plateverify', 'admin')
  public async list(@Response() res, @Body() body) {
    const result = await this.schoolService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('new')
  @Roles('plateverify', 'admin')
  public async new(@Response() res, @Body() schoolCreateDto: SchoolCreateDto) {
    const result = await this.schoolService.create(schoolCreateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles('plateverify', 'admin')
  public async update(@Response() res, @Body() schoolUpdateDto: SchoolUpdateDto) {
    const result = await this.schoolService.update(schoolUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('logo')
  @Roles('plateverify', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  public async logo(@Response() res, @Body() body, @UploadedFile() file) {
    const result = await this.schoolService.uploadLogo({
      id: body.id,
      buffer: file.buffer,
      ext: file.mimetype.split('/')[1]
    });
    return res.status(HttpStatus.OK).json(result);
  }

}
