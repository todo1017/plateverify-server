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
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { MemberService } from './member.service';
import { Member } from './member.entity';
import { MemberSearchDto } from './dto/member-search.dto';
import { MemberImportDto } from './dto/member-import.dto';
import { MemberCreateDto } from './dto/member-create.dto';
import { MemberUpdateDto } from './dto/member-update.dto';
import * as Papa from 'papaparse';

@Controller('member')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class MemberController {

  constructor(private readonly memberService: MemberService) {}

  @Post('search')
  @Roles('school', 'admin')
  public async search(@Response() res, @Body() memberSearchDto: MemberSearchDto): Promise<Pagination<Member>> {
    const result = await this.memberService.paginate(memberSearchDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('parse')
  @Roles('school', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  public async parse(@Response() res, @UploadedFile() file) {
    if (file.mimetype !== 'text/csv') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Not CSV file'
      });
    }

    const result = Papa.parse(file.buffer.toString(), {header:true, skipEmptyLines:true});

    return res.status(HttpStatus.OK).json({
      success: true,
      result: {
        data: result.data,
        fields: result.meta.fields
      }
    });
  }

  @Post('import')
  @Roles('school', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  public async import(
    @Response() res,
    @UploadedFile() file,
    @Body() memberImportDto: MemberImportDto
  ) {

    if (file.mimetype !== 'text/csv') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Not CSV file'
      });
    }

    const result = Papa.parse(file.buffer.toString(), {header:true, skipEmptyLines:true});
    let failedRows = [];

    for (const key in result.data) {
      let success = this.memberService.import(memberImportDto, result.data[key]);
      if (!success) {
        failedRows.push(result.data[key]);
      }
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      failedRows
    });
  }

  @Post('new')
  @Roles('school', 'admin')
  public async new(@Response() res, @Body() memberCreateDto: MemberCreateDto) {
    const result = await this.memberService.create(memberCreateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('update')
  @Roles('school', 'admin')
  public async update(@Response() res, @Body() memberUpdateDto: MemberUpdateDto) {
    const result = await this.memberService.update(memberUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

}
