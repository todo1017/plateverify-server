import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from 'src/entities/school.entity';
import { UserModule } from 'src/security/user/user.module';
import { PschoolService } from './pschool.service';
import { PschoolController } from './pschool.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([School]),
    UserModule
  ],
  providers: [PschoolService],
  controllers: [PschoolController]
})
export class PschoolModule {}
