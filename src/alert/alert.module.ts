import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolModule } from 'src/school/school.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { Record } from 'src/record/record.entity';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record]),
    SchoolModule,
    VehicleModule
  ],
  providers: [AlertService],
  controllers: [AlertController],
  exports: [AlertService]
})
export class AlertModule {}
