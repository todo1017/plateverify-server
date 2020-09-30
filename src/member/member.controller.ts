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
import { Pagination } from 'nestjs-typeorm-paginate';
import * as Papa from 'papaparse';
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL } from "src/constants/role.type";
import { VehicleService } from 'src/vehicle/vehicle.service';
import { MemberService } from './member.service';
import { Member } from './member.entity';
import { MemberListDto } from './dto/member-list.dto';
import { MemberImportDto } from './dto/member-import.dto';
import { MemberViewDto } from './dto/member-view.dto';
import { MemberUpdateDto } from './dto/member-update.dto';
import { MemberRemoveDto } from './dto/member-remove.dto';
import { FindVehicleDto } from './dto/find-vehicle.dto';
import { ConnectVehicleDto } from './dto/connect-vehicle.dto';

@Controller('member')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class MemberController {

  constructor(
    private readonly memberService: MemberService,
    private readonly vehicleService: VehicleService,
  ) {}

  @Post('list')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async list(
    @Response() res,
    @Request() req,
    @Body() memberListDto: MemberListDto
  ): Promise<Pagination<Member>> {
    const result = await this.memberService.paginate(
      {
        page: memberListDto.page,
        limit: memberListDto.limit
      },
      memberListDto.group,
      req.user.schoolId
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('parse')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async parse(@Response() res, @UploadedFile() file) {
    const result = Papa.parse(file.buffer.toString(), {header:true, skipEmptyLines:true});
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('import')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async import_student(
    @Response() res,
    @Request() req,
    @UploadedFile() file,
    @Body() memberImportDto: MemberImportDto
  ) {
    const result = await this.memberService.import(memberImportDto, file, req.user.schoolId);
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('view')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async view(@Response() res, @Body() memberViewDto: MemberViewDto) {
    const result = await this.memberService.view(memberViewDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async update(@Response() res, @Body() memberUpdateDto: MemberUpdateDto) {
    const result = await this.memberService.update(memberUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('remove')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async remove(@Response() res, @Body() memberRemoveDto: MemberRemoveDto) {
    const result = await this.memberService.remove(memberRemoveDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('find')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async find(
    @Response() res,
    @Request() req,
    @Body() findVehicleDto: FindVehicleDto
  ) {
    try {
      const result = await this.vehicleService.find(findVehicleDto.keyword, req.user.schoolId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

  @Post('connect')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async connect(@Response() res, @Body() connectVehicleDto: ConnectVehicleDto) {
    try {
      const { memberId, remove, add } = connectVehicleDto;
      for (let i = 0; i < remove.length; i++) {
        await this.vehicleService.disconnect(remove[i]);
      }
      for (let i = 0; i < add.length; i++) {
        await this.vehicleService.connect(add[i], memberId);
      }
      const result = await this.memberService.view({ id: memberId });
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
    
  }

}
