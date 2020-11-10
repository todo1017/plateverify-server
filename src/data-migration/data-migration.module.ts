import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolModule } from "src/school/school.module";
import { DataMigration } from "./data-migration.entity";
import { DataMigrationService } from './data-migration.service';
import { DataMigrationController } from './data-migration.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DataMigration]),
    SchoolModule
  ],
  providers: [DataMigrationService],
  controllers: [DataMigrationController]
})
export class DataMigrationModule {}
