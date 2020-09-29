import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolModule } from 'src/school/school.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { Record } from './record.entity';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record]),
    SchoolModule,
    VehicleModule
  ],
  controllers: [RecordController],
  providers: [RecordService],
  exports: [RecordService]
})
export class RecordModule {}
