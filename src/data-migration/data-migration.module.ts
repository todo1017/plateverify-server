import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { SchoolModule } from "src/school/school.module";
import { SettingModule } from "src/setting/setting.module";
import { OffenderModule } from "src/offender/offender.module";
import { MemberModule } from "src/member/member.module";
import { VehicleModule } from "src/vehicle/vehicle.module";
import { RecordModule } from "src/record/record.module";
import { UserModule } from "src/user/user.module";
import { DataMigration } from "./data-migration.entity";
import { DataMigrationService } from './data-migration.service';
import { DataMigrationController } from './data-migration.controller';
import { DataMigrationQueue } from './data-migration.queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([DataMigration]),
    BullModule.registerQueue({ name: 'data-migration' }),
    SchoolModule,
    SettingModule,
    OffenderModule,
    MemberModule,
    VehicleModule,
    RecordModule,
    UserModule
  ],
  providers: [DataMigrationService, DataMigrationQueue],
  controllers: [DataMigrationController]
})
export class DataMigrationModule {}
