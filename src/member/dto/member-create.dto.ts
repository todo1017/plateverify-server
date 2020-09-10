import { VehicleCreateDto } from "src/vehicle/dto/vehicle-create.dto";
export class MemberCreateDto {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  phone: string;
  grade: string;
  graduation: string;
  new_vehicles: VehicleCreateDto[];
  old_vehicles: string[];
}