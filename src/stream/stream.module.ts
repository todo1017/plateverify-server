import { Module } from '@nestjs/common';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { TwilioModule } from 'nestjs-twilio';
import { StreamController } from './stream.controller';
import { RecordModule } from 'src/record/record.module';
import { SchoolModule } from 'src/school/school.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { OffenderModule } from 'src/offender/offender.module';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [
    SendGridModule.forRoot({
      apiKey: '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',
    }),
    TwilioModule.forRoot({
      accountSid: 'AC013f89d6ae77f8e1374b6ca8e8b35931',
      authToken: 'ae97d01ce87736025fa4bc48032902e5',
      // accountSid: process.env.TWILIO_ACCOUNT_SID,
      // authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    RecordModule,
    SchoolModule,
    VehicleModule,
    OffenderModule,
    SettingModule
  ],
  controllers: [StreamController]
})
export class StreamModule {}
