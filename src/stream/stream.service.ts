import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class StreamService {

  constructor (
    @InjectQueue('stream') private streamQueue: Queue,
  ) {}

  public async input(data: any) {
    this.streamQueue.add('input', { data });
  }

}