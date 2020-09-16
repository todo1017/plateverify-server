import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { School } from './school.entity';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([School]),
    UserModule
  ],
  providers: [SchoolService],
  controllers: [SchoolController],
  exports: [SchoolService],
})
export class SchoolModule {}
