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
import { ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL } from "src/constants/role.type";
import { Record } from 'src/record/record.entity';
import { AlertService } from './alert.service';
import { AlertSearchDto } from './dto/alert-search.dto';
import { AlertViewDto } from './dto/alert-view.dto';

@Controller('alert')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class AlertController {

  constructor(private readonly alertService: AlertService) {}

  @Post('search')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async search(
    @Response() res,
    @Request() req,
    @Body() alertSearchDto: AlertSearchDto
  ): Promise<Pagination<Record>>{
    const result = await this.alertService.paginate(
      {
        page: alertSearchDto.page,
        limit: alertSearchDto.limit
      },
      alertSearchDto,
      req.user.schoolId
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('view')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async view(@Response() res, @Body() alertViewDto: AlertViewDto) {
    try {
      const result = await this.alertService.view(alertViewDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

}
