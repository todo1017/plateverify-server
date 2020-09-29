import {
  Controller,
  UseGuards,
  HttpStatus,
  Post,
  Response,
  Request,
  Body,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { RecordService } from 'src/record/record.service';
import { SchoolService } from 'src/school/school.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { OffenderService } from 'src/offender/offender.service';

@Controller('stream')
export class StreamController {

  constructor(
    private readonly recordService: RecordService,
    private readonly schoolService: SchoolService,
    private readonly vehicleService: VehicleService,
    private readonly offenderService: OffenderService,
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
      let visitorName = 'unknown';
      if (offenderReg) {
        visitorType = 'offender';
        visitorName = offenderReg.name;
      } else if (vehicleReg) {
        if (vehicleReg.member) {
          visitorType = vehicleReg.member.group;
          visitorName = vehicleReg.member.first_name + ' ' + vehicleReg.member.last_name;
        }
        if (vehicleReg.flagged) {
          visitorType = 'flagged';
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
        meta: {
          visitorType,
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
      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({error});
    }
  }

}
