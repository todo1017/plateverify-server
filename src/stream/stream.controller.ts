import {
  Controller,
  HttpStatus,
  Post,
  Response,
  Body,
} from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import * as moment from 'moment';
import { RecordService } from 'src/record/record.service';
import { SchoolService } from 'src/school/school.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { OffenderService } from 'src/offender/offender.service';
import { SettingService } from 'src/setting/setting.service';

@Controller('stream')
export class StreamController {

  constructor(
    @InjectSendGrid() private readonly sendgridClient: SendGridService,
    @InjectTwilio() private readonly twilioClient: TwilioClient,
    private readonly recordService: RecordService,
    private readonly schoolService: SchoolService,
    private readonly vehicleService: VehicleService,
    private readonly offenderService: OffenderService,
    private readonly settingService: SettingService,
  ) {}

  @Post('input')
  public async input(
    @Response() res,
    @Body() data: any
  ): Promise<any> {
    let { agent, camera, plate, data: { vehicle, agent_uid, best_uuid, company_id, travel_direction } } = data;

    try {
      const schoolReg = await this.schoolService.findBySlug(agent);
      const offenderReg = await this.offenderService.findByPlate(plate);
      const vehicleReg = await this.vehicleService.findByPlateSchool(plate, schoolReg.id);

      let visitorType = 'unknown';
      let visitorGroup = 'unknown';
      let visitorName = 'unknown';
      let alert = '';
      if (offenderReg) {
        visitorType = 'offender';
        visitorGroup = 'offender';
        visitorName = offenderReg.name;
        alert = 'active';
      } else if (vehicleReg) {
        if (vehicleReg.member) {
          visitorType = vehicleReg.member.group;
          visitorGroup = vehicleReg.member.group;
          visitorName = vehicleReg.member.first_name + ' ' + vehicleReg.member.last_name;
        }
        if (vehicleReg.flagged) {
          visitorType = 'flagged';
          alert = 'active';
        }
      }

      let location = 'unknown';
      let direction = 'unknown';
      const cameraReg = schoolReg.cameras.filter(c => c.slug === camera)[0];
      if (cameraReg) {
        location = cameraReg.name;
        const minCheck = travel_direction > cameraReg.angle - cameraReg.tolerance;
        const maxCheck = travel_direction < cameraReg.angle + cameraReg.tolerance;
        if (minCheck && maxCheck) {
          direction = 'ENTERING';
        } else {
          direction = 'EXITING';
        }
      }

      this.recordService.create({
        schoolId: schoolReg.id,
        offenderId: offenderReg ? offenderReg.id : null,
        vehicleId: vehicleReg ? vehicleReg.id : null,
        memberId: vehicleReg ? vehicleReg.memberId : null,
        plate,
        alert,
        meta: {
          visitorType,
          visitorGroup,
          visitorName,
          plate,
          location,
          direction,
          vehicleMake: vehicle.make[0].name,
          vehicleMakeModel: vehicle.make_model[0].name,
          vehicleBodyType: vehicle.body_type[0].name,
          vehicleColor: vehicle.color[0].name,
          photo: `https://cloud.openalpr.com/img/${agent_uid}/${best_uuid}?company_id=${company_id}`
        }
      });

      if (alert) {
        const alertSetting = await this.settingService.findByCategory(schoolReg.id, 'alert');

        if (alertSetting) {
          for (let i = 0; i < alertSetting.body.length; i++) {
            const alertOption = alertSetting.body[i];
            const isAlert = (visitorType === 'offender' && alertOption.offender) || (visitorType === 'flagged' && alertOption.flagged);
            if (isAlert) {
              const time = moment().subtract(schoolReg.timezone, 'hour').format('h:mm');
              const day = moment().subtract(schoolReg.timezone, 'hour').format('MM/DD/YY');
              if (alertOption.type === 'email') {
                this.sendgridClient.send({
                  to: alertOption.entity,
                  from: 'admin@plateveiry.com',
                  templateId: 'd-97ad37c4fc7c4060b42096291f52fe92',
                  dynamicTemplateData: {
                    direction,
                    location,
                    time,
                    day,
                    plate  : plate.toUpperCase(),
                    type   : visitorType.toUpperCase(),
                    driver : visitorName,
                    color  : vehicle.color[0].name,
                    model  : vehicle.make_model[0].name,
                    link   : 'https://plateverify.com',
                  }
                });
              }
              if (alertOption.type === 'sms') {
                this.twilioClient.messages.create({
                  // body: 'SMS Body, sent to the phone!',
                  body: `${visitorType.toUpperCase()} Vehicle Detected
                    \n${direction} at ${location} at ${time} on ${day}
                    \n${vehicle.color[0].name}, ${vehicle.make_model[0].name}, ${plate.toUpperCase()}
                    \nDriver: ${visitorName}
                  `,
                  // mediaUrl: 'https://plateverify.com',
                  from: '+12016693289',
                  // from: process.env.TWILIO_PHONE_NUMBER,
                  to: alertOption.entity,
                }).then(message => console.log(message));
              }
            }
          }
        }
      }

      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

}
