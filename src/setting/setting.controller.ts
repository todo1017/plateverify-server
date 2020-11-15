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
import { ROLE_SCOPE_SCHOOL } from "src/constants/role.type";
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';
import { SettingStartDto } from './dto/setting-start.dto';
import { SettingUpdateDto } from './dto/setting-update.dto';

@Controller('setting')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class SettingController {

  constructor(private readonly settingService: SettingService) {}

  @Post('start')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async start(
    @Response() res,
    @Request() req,
    @Body() settingStartDto: SettingStartDto
  ): Promise<Setting> {
    const result = await this.settingService.start(settingStartDto, req.user.schoolId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('all')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async all(
    @Response() res,
    @Request() req
  ): Promise<Setting> {
    const result = await this.settingService.find(req.user.schoolId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async update(
    @Response() res,
    @Request() req,
    @Body() settingUpdateDto: SettingUpdateDto
  ): Promise<Setting> {
    try {
      const result = await this.settingService.update(settingUpdateDto, req.user.schoolId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

}