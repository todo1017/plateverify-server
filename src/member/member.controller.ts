import {
  Controller,
  UseGuards,
  HttpStatus,
  Post,
  Response,
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
import { MEMBER_TYPE_STUDENT, MEMBER_TYPE_FACULTY } from "src/constants/member.type";
import { MemberService } from './member.service';
import { Member } from './member.entity';
import { MemberSearchDto } from './dto/member-search.dto';
import { MemberImportDto } from './dto/member-import.dto';
import { MemberCreateDto } from './dto/member-create.dto';
import { MemberUpdateDto } from './dto/member-update.dto';

@Controller('member')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class MemberController {

  constructor(private readonly memberService: MemberService) {}

  @Post('search')
  @Roles(ROLE_SCOPE_SCHOOL)
  public async search(@Response() res, @Body() memberSearchDto: MemberSearchDto): Promise<Pagination<Member>> {
    const result = await this.memberService.paginate(memberSearchDto);
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

  @Post('import_student')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async import_student(@Response() res, @UploadedFile() file, @Body() memberImportDto: MemberImportDto) {
    const result = this.memberService.import(memberImportDto, file, MEMBER_TYPE_STUDENT);
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('import_faculty')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  @UseInterceptors(FileInterceptor('file'))
  public async import_faculty(@Response() res, @UploadedFile() file, @Body() memberImportDto: MemberImportDto) {
    let result = this.memberService.import(memberImportDto, file, MEMBER_TYPE_FACULTY);
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('new_student')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async new_student(@Response() res, @Body() memberCreateDto: MemberCreateDto) {
    const result = await this.memberService.create(memberCreateDto, MEMBER_TYPE_STUDENT);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('new_faculty')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async new_faculty(@Response() res, @Body() memberCreateDto: MemberCreateDto) {
    const result = await this.memberService.create(memberCreateDto, MEMBER_TYPE_FACULTY);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles(ROLE_SCOPE_SCHOOL, ROLE_MANAGE_ALL)
  public async update(@Response() res, @Body() memberUpdateDto: MemberUpdateDto) {
    const result = await this.memberService.update(memberUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

}
