import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './security/auth/auth.module';
import { UserModule } from './security/user/user.module';
import { PschoolModule } from './plateverify/pschool/pschool.module';
import { PuserModule } from './plateverify/puser/puser.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    PschoolModule,
    PuserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
