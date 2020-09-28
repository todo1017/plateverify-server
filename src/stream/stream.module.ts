import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { RecordModule } from 'src/record/record.module';
import { SchoolModule } from 'src/school/school.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';

@Module({
  imports: [
    RecordModule,
    SchoolModule,
    VehicleModule
  ],
  controllers: [StreamController]
})
export class StreamModule {}
