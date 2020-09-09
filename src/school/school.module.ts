import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from 'src/entities/school.entity';
import { UserModule } from 'src/user/user.module';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([School]),
    UserModule
  ],
  providers: [SchoolService],
  controllers: [SchoolController]
})
export class SchoolModule {}
