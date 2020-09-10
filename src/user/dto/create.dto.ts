export class UserCreateDto {
  name: string;
  email: string;
  password: string;
  roles: string[];
  school?: any;
}