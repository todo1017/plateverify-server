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
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL } from "src/constants/role.type";
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';
import { SettingGetDto } from './dto/setting-get.dto';
import { SettingUpdateDto } from './dto/setting-update.dto';

@Controller('setting')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class SettingController {

  constructor(private readonly settingService: SettingService) {}

  @Post('get')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async get(
    @Response() res,
    @Request() req,
    @Body() settingGetDto: SettingGetDto
  ): Promise<Setting> {
    const result = await this.settingService.find(settingGetDto.category, req.user.schoolId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async update(
    @Response() res,
    @Request() req,
    @Body() settingUpdateDto: SettingUpdateDto
  ): Promise<Setting> {
    const result = await this.settingService.update(settingUpdateDto, req.user.schoolId);
    return res.status(HttpStatus.OK).json(result);
  }

}