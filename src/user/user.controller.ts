import {
  Controller,
  UseGuards,
  HttpStatus,
  Response,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from "src/guard/role.guard";
import { Roles } from "src/guard/roles.decorator";
import { ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL } from "src/constants/role.type";
import { SchoolService } from 'src/school/school.service';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserRemoveDto } from './dto/user-remove.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class UserController {

  constructor(
    private schoolService: SchoolService,
    private userService: UserService,
  ) {}

  @Post('list')
  @Roles(ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL)
  public async list(@Response() res) {
    const users = await this.userService.findAll();
    const schools = await this.schoolService.findAll();
    return res.status(HttpStatus.OK).json({ users, schools });
  }

  @Post('new')
  @Roles(ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL)
  public async new(@Response() res, @Body() userCreateDto: UserCreateDto) {
    const user = {
      ...userCreateDto,
      active: false,
    };
    const result = await this.userService.create(user);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('activate')
  @Roles(ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL)
  public async activate(@Response() res, @Body() userUpdateDto: UserUpdateDto) {
    const result = await this.userService.activate(userUpdateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('remove')
  @Roles(ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL)
  public async remove(@Response() res, @Body() userRemoveDto: UserRemoveDto) {
    const result = await this.userService.delete(userRemoveDto.id);
    return res.status(HttpStatus.OK).json(result);
  }
  
}
