import {
  Controller,
  UseGuards,
  HttpStatus,
  Response,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from "src/security/role.guard";
import { Roles } from "src/security/roles.decorator";
import { UserService } from 'src/security/user/user.service';
import { UserCreateDto } from 'src/security/user/dto/create.dto';
import { UserActivateDto } from 'src/security/user/dto/activate.dto';
import { UserRemoveDto } from 'src/security/user/dto/remove.dto';

@Controller('p/user')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class PuserController {

  constructor(
    private userService: UserService,
  ) {}

  @Post('list')
  @Roles('plateverify')
  public async list(@Response() res) {
    const result = await this.userService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('new')
  @Roles('plateverify', 'admin')
  public async new(@Response() res, @Body() userCreateDto: UserCreateDto) {
    const user = {
      ...userCreateDto,
      active: false,
    };
    const result = await this.userService.create(user);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('activate')
  @Roles('plateverify', 'admin')
  public async activate(@Response() res, @Body() userActivateDto: UserActivateDto) {
    const result = await this.userService.activate(userActivateDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('remove')
  @Roles('plateverify', 'admin')
  public async remove(@Response() res, @Body() userRemoveDto: UserRemoveDto) {
    const result = await this.userService.delete(userRemoveDto.id);
    return res.status(HttpStatus.OK).json(result);
  }

}
