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

  @Post('update_logo')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  @UseInterceptors(FileInterceptor('file'))
  public async update_logo(@Response() res, @Body() body, @UploadedFile() file) {
    try {
      const result = await this.schoolService.uploadLogo(body.id, file.buffer, file.mimetype.split('/')[1]);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

  @Post('update_cameras')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  public async update_cameras(@Response() res, @Body() body) {
    try {
      const cameras = body.cameras.map(camera => ({
        ...camera,
        slug: slugify(camera.name, { replacement: '_', lower: true }),
      }));
      const result = await this.schoolService.updateCameras(body.id, cameras);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

  @Post('update_general')
  @Roles(ROLE_SCOPE_PLATEVERIFY)
  public async update_general(@Response() res, @Body() body) {
    try {
      const result = await this.schoolService.updateGeneral(body.id, body.name, body.live, body.timezone);
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
