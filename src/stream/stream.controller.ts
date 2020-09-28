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

@Controller('stream')
export class StreamController {

  constructor(
    private readonly recordService: RecordService,
    private readonly schoolService: SchoolService,
    private readonly vehicleService: VehicleService,
  ) {}

  @Post('input')
  public async list(
    @Response() res,
    @Body() data: any
  ): Promise<any> {
    let { agent, camera, plate, data: { vehicle, agent_uid, best_uuid, company_id, travel_direction } } = data;

    try {
      const schoolReg = await this.schoolService.findBySlug(agent);
      const vehicleReg = await this.vehicleService.findByPlateSchool(plate, schoolReg.id);

      let visitorType = 'unknown';
      let visitorName = 'unknown';
      if (vehicleReg && vehicleReg.member) {
        visitorType = vehicleReg.member.group;
        visitorName = vehicleReg.member.first_name + ' ' + vehicleReg.member.last_name;
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
        vehicleId: vehicleReg ? vehicleReg.id : null,
        memberId: vehicleReg ? vehicleReg.memberId : null,
        meta: {
          visitorType,
          visitorName,
          plate,
          location,
          vehicleMake: vehicle.make[0].name,
          vehicleMakeModel: vehicle.make_model[0].name,
          vehicleBodyType: vehicle.body_type[0].name,
          vehicleColor: vehicle.color[0].name,
          photo: `https://cloud.openalpr.com/img/${agent_uid}/${best_uuid}?company_id=${company_id}`
        }
      })
      return res.status(HttpStatus.OK).json({
        schoolId: schoolReg.id,
        vehicleId: vehicleReg.id,
        memberId: vehicleReg.memberId,
        meta: {
          visitorType,
          visitorName,
          plate,
          location,
          vehicleMake: vehicle.make[0].name,
          vehicleMakeModel: vehicle.make_model[0].name,
          vehicleBodyType: vehicle.body_type[0].name,
          vehicleColor: vehicle.color[0].name,
          photo: `https://cloud.openalpr.com/img/${agent_uid}/${best_uuid}?company_id=${company_id}`
        }
      }); 
    } catch (error) {
    }
  }

}
