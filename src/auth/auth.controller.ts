import {
  Controller,
  UseGuards,
  HttpStatus,
  Response,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  public async login(
    @Response() res,
    @Body() loginDto: LoginDto
  ) {
    const result = await this.authService.checkUser(loginDto);

    if (!result.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Login Failed',
      });
    } else {
      const token = this.authService.createToken(loginDto);
      return res.status(HttpStatus.OK).json({ token });
    }
  }

  @Post('check')
  @UseGuards(AuthGuard('jwt'))
  public async check(
    @Response() res,
    @Request() req
  ) {
    return res.status(HttpStatus.OK).json({
      user: {
        name: req.user.name,
        email: req.user.email,
        active: req.user.active,
        roles: req.user.roles,
        school: req.user.school ? {
          name: req.user.school.name,
          slug: req.user.school.slug,
          logo: req.user.school.logo,
          live: req.user.school.live,
        } : null
      }
    });
  }

  @Post('seed')
  public async seed(@Response() res) {
    const valid = await this.authService.seedAdmin();
    if (!valid) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed',
      });
    } else {
      return res.status(HttpStatus.OK).json({
        message: 'success'
      });
    }
  }
}
