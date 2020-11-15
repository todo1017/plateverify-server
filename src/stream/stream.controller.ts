import {
  Controller,
  HttpStatus,
  Post,
  Response,
  Body,
} from '@nestjs/common';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {

  constructor(
    private readonly streamService: StreamService,
  ) {}

  @Post('input')
  public async input(@Response() res, @Body() data: any): Promise<any> {
    await this.streamService.input(data);
    return res.status(HttpStatus.OK).json({ success: true });
  }

}
