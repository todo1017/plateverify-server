import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offender } from './offender.entity';
import { OffenderService } from './offender.service';
import { OffenderController } from './offender.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offender]),
  ],
  providers: [OffenderService],
  controllers: [OffenderController]
})
export class OffenderModule {}
