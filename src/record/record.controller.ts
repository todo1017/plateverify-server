import {
  Controller,
  UseGuards,
  HttpStatus,
  Post,
  Response,
  Request,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { ROLE_SCOPE_SCHOOL } from "src/constants/role.type";
import { RecordService } from './record.service';
import { Record } from './record.entity';
import { RecordSearchDto } from './dto/record-search.dto';
import { RecordViewDto } from './dto/record-view.dto';

@Controller('record')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class RecordController {
  
  constructor(private readonly recordService: RecordService) {}

  @Post('search')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async search(
    @Response() res,
    @Request() req,
    @Body() recordSearchDto: RecordSearchDto
  ): Promise<Pagination<Record>>{
    const result = await this.recordService.paginate(
      {
        page: recordSearchDto.page,
        limit: recordSearchDto.limit
      },
      recordSearchDto,
      req.user.schoolId
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('view')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async view(@Response() res, @Body() recordViewDto: RecordViewDto) {
    try {
      const result = await this.recordService.view(recordViewDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

  @Post('stats')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async stats(@Response() res, @Request() req) {
    try {
      const result = await this.recordService.stats(req.user.schoolId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

}
