import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL } from 'src/constants/role.type';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  // async register(registerDto: RegisterDto): Promise<any> {
  //   let status = { success: true, message: '' };

  //   try {
  //     await this.userService.create(registerDto);
  //   } catch (err) {
  //     status = { success: false, message: err };
  //   }
    
  //   return status;
  // }

  async checkUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);
    const result = user && await user.comparePassword(loginDto.password);

    if (result && user.active) {
      return {
        success: true,
        user
      }
    }

    return { success: false };
  }

  createToken(user: any) {
    return this.jwtService.sign(user);
  }

  async checkToken(payload: any): Promise<User> {
    return await this.userService.findByEmail(payload.email);
  }

  async seedAdmin() {
    let superadmin = {
      name: "Frank Petruccelli",
      email: "admin@plateverify.com",
      password: "plateverify4k",
      active: true,
      roles: [ROLE_SCOPE_PLATEVERIFY, ROLE_MANAGE_ALL]
    };
    return await this.userService.create(superadmin);
  }

}
