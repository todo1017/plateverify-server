import {
  Controller,
  HttpStatus,
  Response,
  Post,
  Body,
} from '@nestjs/common';
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
    const valid = await this.authService.checkUser(loginDto);
    if (!valid) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'User Not Found',
      });
    } else {
      const token = this.authService.createToken(loginDto);
      return res.status(HttpStatus.OK).json(token);
    }
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
