import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { DataMigrationService } from './data-migration.service';
import { SchoolService } from "src/school/school.service";
import { SettingService } from "src/setting/setting.service";
import { OffenderService } from "src/offender/offender.service";
import { MemberService } from "src/member/member.service";
import { VehicleService } from "src/vehicle/vehicle.service";
import { RecordService } from "src/record/record.service";
import { UserService } from "src/user/user.service";
import { ROLE_SCOPE_SCHOOL, ROLE_SCOPE_PLATEVERIFY } from "src/constants/role.type";

@Processor('data-migration')
export class DataMigrationQueue {

  constructor (
    private readonly dataMigrationService: DataMigrationService,
    private readonly schoolService: SchoolService,
    private readonly settingService: SettingService,
    private readonly offenderService: OffenderService,
    private readonly memberService: MemberService,
    private readonly vehicleService: VehicleService,
    private readonly recordService: RecordService,
    private readonly userService: UserService,
  ) {}
  

  @Process('school')
  async school(job: Job) {
    try {
      await this.dataMigrationService.updateStatus('school', 'running');
      const schools = job.data.records;
      for (let i = 0; i < schools.length; i++) {
        const school = await this.schoolService.create({
          name: schools[i].name,
          live: schools[i].live,
          timezone: schools[i].timezone
        });
        await this.dataMigrationService.create({
          category: 'school_id',
          key: schools[i].id,
          value: school.id
        });
      }
      await this.dataMigrationService.updateStatus('school', 'done');
    } catch (error) {
      await this.dataMigrationService.updateStatus('school', 'error');
    }
  }

  @Process('camera')
  async camera(job: Job) {
    try {
      await this.dataMigrationService.updateStatus('camera', 'running');
      const cameras = job.data.records;
      for (let i = 0; i < cameras.length; i++) {
        const schoolId = await this.dataMigrationService.getValue('school_id', cameras[i].school_id);
        await this.dataMigrationService.create({
          category: 'camera_value',
          key: cameras[i].id,
          value: JSON.stringify({
            name: cameras[i].name,
            angle: cameras[i].angle,
            tolerance: cameras[i].tolerance,
          })
        });
        await this.schoolService.addCamera(schoolId, cameras[i]);
      }
      await this.dataMigrationService.updateStatus('camera', 'done');
    } catch (error) {
      await this.dataMigrationService.updateStatus('camera', 'error');
    }
  }

  @Process('setting')
  async setting(job: Job) {
    try {
      await this.dataMigrationService.updateStatus('setting', 'running');
      const settings = job.data.records;
      for (let i = 0; i < settings.length; i++) {

        if (settings[i].title === 'phone-list') {
          const list = JSON.parse(settings[i].content);
          const entities = list.map(d => ({
            type: 'sms',
            entity: d,
            offfender: false,
            flagged: false
          }));
          const schoolId = await this.dataMigrationService.getValue('school_id', settings[i].school_id);
          if (schoolId) {
            await this.settingService.addAlertEntity(entities, schoolId);
          }
        }

        if (settings[i].title === 'email-list') {
          const list = JSON.parse(settings[i].content);
          const entities = list.map(d => ({
            type: 'email',
            entity: d,  
            offfender: false,
            flagged: false
          }));
          const schoolId = await this.dataMigrationService.getValue('school_id', settings[i].school_id);
          if (schoolId) {
            await this.settingService.addAlertEntity(entities, schoolId);
          }
        }

      }
      await this.dataMigrationService.updateStatus('setting', 'done');
    } catch (error) {
      console.log('error', error);
      await this.dataMigrationService.updateStatus('setting', 'error');
    }
  }

  @Process('offender')
  async offender(job: Job) {
    try {
      await this.dataMigrationService.updateStatus('offender', 'running');
      const offenders = job.data.records;
      for (let i = 0; i < offenders.length; i++) {
        await this.offenderService.create2({
          name          : offenders[i].name,
          address       : offenders[i].address,
          risk_level    : offenders[i].risk_level,
          plate         : offenders[i].plate_number,
          vehicle_make  : offenders[i].vehicle_make,
          vehicle_model : offenders[i].vehicle_model,
          vehicle_color : offenders[i].vehicle_color,
          vehicle_year  : offenders[i].vehicle_year,
          vehicle_state : offenders[i].vehicle_state,
        });
      }
      await this.dataMigrationService.updateStatus('offender', 'done');
    } catch (error) {
      await this.dataMigrationService.updateStatus('offender', 'error');
    }
  }

  @Process('member')
  async member(job: Job) {
    try {
      await this.dataMigrationService.updateStatus('member', 'running');
      const members = job.data.records;
      for (let i = 0; i < members.length; i++) {
        const schoolId = await this.dataMigrationService.getValue('school_id', members[i].school_id);
        if (schoolId && ['faculty', 'student'].includes(members[i].permit)) {
          const member = await this.memberService.create({
            schoolId,
            first_name: members[i].first_name,
            last_name: members[i].last_name,
            address: members[i].address + ' ' + members[i].address_add,
            group: members[i].permit,
            email: members[i].email,
            phone: members[i].phone,
            grade: members[i].grade,
            graduation: members[i].graduation,
            tag: members[i].tag
          });
          await this.dataMigrationService.create({
            category: 'member_id',
            key: members[i].id,
            value: member.id
          });
        } else {
          await this.dataMigrationService.create({
            category: 'member_id',
            key: 'none',
            value: members[i].id
          });
        }
      }
      await this.dataMigrationService.updateStatus('member', 'done');
    } catch (error) {
      console.log('error', error);
      await this.dataMigrationService.updateStatus('member', 'error');
    }
  }

  @Process('vehicle')
  async vehicle(job: Job) {
    try {
      await this.dataMigrationService.updateStatus('vehicle', 'running');
      const noneMembers = await this.dataMigrationService.getValues('member_id', 'none');
      const vehicles = job.data.records;
      for (let i = 0; i < vehicles.length; i++) {
        const schoolId = await this.dataMigrationService.getValue('school_id', vehicles[i].school_id);
        if (schoolId && !noneMembers.includes(vehicles[i].member_id)) {
          const memberId = await this.dataMigrationService.getValue('member_id', vehicles[i].member_id);
          await this.vehicleService.create({
            schoolId,
            memberId,
            plate: vehicles[i].plate,
            make: vehicles[i].make,
            model: vehicles[i].model,
            body: vehicles[i].body_type,
            color: vehicles[i].color,
          });
        }
      }
      await this.dataMigrationService.updateStatus('vehicle', 'done');
    } catch (error) {
      console.log('error', error);
      await this.dataMigrationService.updateStatus('vehicle', 'error');
    }
  }

  @Process('record')
  async record(job: Job) {
    try {
      await this.dataMigrationService.updateStatus('record', 'running');
      const records = job.data.records;
      for (let i = 0; i < records.length; i++) {
        let {
          school_id,
          camera_id,
          best_plate,
          direction_of_travel_degrees,
          vehicle_make,
          vehicle_make_model,
          vehicle_body_type,
          vehicle_color,
          agent_uid,
          best_uuid,
          company,
          created_at
        } = records[i];

        const schoolId = await this.dataMigrationService.getValue('school_id', school_id);
        const cameraValue = await this.dataMigrationService.getValue('camera_value', camera_id);

        if (schoolId && cameraValue) {
          const offenderReg = await this.offenderService.findByPlate(best_plate);
          const vehicleReg = await this.vehicleService.findByPlateSchool(best_plate, schoolId);

          let visitorType = 'unknown';
          let visitorGroup = 'unknown';
          let visitorName = 'unknown';
          let alert = '';
          if (offenderReg) {
            visitorType = 'offender';
            visitorGroup = 'offender';
            visitorName = offenderReg.name;
          } else if (vehicleReg) {
            if (vehicleReg.member) {
              visitorType = vehicleReg.member.group;
              visitorGroup = vehicleReg.member.group;
              visitorName = vehicleReg.member.first_name + ' ' + vehicleReg.member.last_name;
            }
          }

          const cameraReg = JSON.parse(cameraValue);
          let location = cameraReg.name;
          let direction = 'unknown';
          const minCheck = direction_of_travel_degrees > cameraReg.angle - cameraReg.tolerance;
          const maxCheck = direction_of_travel_degrees < cameraReg.angle + cameraReg.tolerance;
          if (minCheck && maxCheck) {
            direction = 'ENTERING';
          } else {
            direction = 'EXITING';
          }

          await this.recordService.create({
            schoolId,
            offenderId: offenderReg ? offenderReg.id : null,
            vehicleId: vehicleReg ? vehicleReg.id : null,
            memberId: vehicleReg ? vehicleReg.memberId : null,
            plate: best_plate,
            alert,
            meta: {
              visitorType,
              visitorGroup,
              visitorName,
              plate: best_plate,
              location,
              direction,
              vehicleMake: vehicle_make,
              vehicleMakeModel: vehicle_make_model,
              vehicleBodyType: vehicle_body_type,
              vehicleColor: vehicle_color,
              photo: `https://cloud.openalpr.com/img/${agent_uid}/${best_uuid}?company_id=${company}`
            },
            created_at,
            updated_at: created_at
          });
        }
      }
      await this.dataMigrationService.updateStatus('record', 'done');
    } catch (error) {
      console.log('error', error);
      await this.dataMigrationService.updateStatus('record', 'error');
    }
  }

  @Process('user')
  async user(job: Job) {
    try {
      await this.dataMigrationService.updateStatus('user', 'running');
      const users = job.data.records;
      for (let i = 0; i < users.length; i++) {
        if (users[i].email !== 'admin@plateverify.com') {
          const schoolId = await this.dataMigrationService.getValue('school_id', users[i].school_id);
          await this.userService.create({
            name: users[i].first_name + ' ' + users[i].last_name,
            email: users[i].email,
            password: 'password1234',
            roles: schoolId? [ROLE_SCOPE_SCHOOL] : [ROLE_SCOPE_PLATEVERIFY],
            schoolId
          });
        }
      }
      await this.dataMigrationService.updateStatus('user', 'done');
    } catch (error) {
      await this.dataMigrationService.updateStatus('user', 'error');
    }
  }

}