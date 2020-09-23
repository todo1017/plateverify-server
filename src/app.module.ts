import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SchoolModule } from './school/school.module';
import { OffenderModule } from './offender/offender.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { MemberModule } from './member/member.module';
import { SettingModule } from './setting/setting.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    SchoolModule,
    OffenderModule,
    VehicleModule,
    MemberModule,
    SettingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
