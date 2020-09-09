import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/security/user/user.module';
import { User } from 'src/entities/user.entity';
import { School } from 'src/entities/school.entity';
import { PuserService } from './puser.service';
import { PuserController } from './puser.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, School]),
    UserModule
  ],
  providers: [PuserService],
  controllers: [PuserController]
})
export class PuserModule {}
