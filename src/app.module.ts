import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SchoolModule } from './school/school.module';
import { OffenderModule } from './offender/offender.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { MemberModule } from './member/member.module';
import { SettingModule } from './setting/setting.module';
import { RecordModule } from './record/record.module';
import { StreamModule } from './stream/stream.module';
import { AlertModule } from './alert/alert.module';
import { DataMigrationModule } from './data-migration/data-migration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    AuthModule,
    UserModule,
    SchoolModule,
    OffenderModule,
    VehicleModule,
    MemberModule,
    SettingModule,
    RecordModule,
    StreamModule,
    AlertModule,
    DataMigrationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
