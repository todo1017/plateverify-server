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
import slugify from "slugify";
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/guard/roles.decorator';
import { ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL } from 'src/constants/role.type';
import { SchoolService } from './school.service';
import { SchoolCreateDto } from './dto/school-create.dto';
import { SchoolUpdateDto } from './dto/school-update.dto';
import { SchoolDetailDto } from './dto/school-detail.dto';

@Controller('school')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class SchoolController {

  constructor(
    private schoolService: SchoolService,
  ) {}

  @Post('list')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  public async list(@Response() res, @Body() body) {
    const result = await this.schoolService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('new')
  @Roles(ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL)
  public async new(@Response() res, @Body() schoolCreateDto: SchoolCreateDto) {
    const result = await this.schoolService.create(schoolCreateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('detail')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  public async detail(@Response() res, @Body() schoolDetailDto: SchoolDetailDto) {
    const result = await this.schoolService.findById(schoolDetailDto.id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles(ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async update(@Response() res, @Body() schoolUpdateDto: SchoolUpdateDto, @UploadedFile() file) {
    try {
      const cameras = JSON.parse(schoolUpdateDto.cameras).map(camera => ({
        name: camera,
        slug: slugify(camera, { replacement: '_', lower: true })
      }));
  
      let logo = '';
      if (file) {
        logo = await this.schoolService.uploadLogo({
          id: schoolUpdateDto.id,
          buffer: file.buffer,
          ext: file.mimetype.split('/')[1]
        });
      }
      
      const result = await this.schoolService.update({
        ...schoolUpdateDto,
        cameras,
        logo
      });
  
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

  @Post('remove')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  public async remove(@Response() res, @Body() schoolDetailDto: SchoolDetailDto) {
    try {
      const result = await this.schoolService.delete(schoolDetailDto.id);
      return res.status(HttpStatus.OK).json(schoolDetailDto);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

}
