import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
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

  async checkUser(loginDto: LoginDto): Promise<boolean> {
    const user = await this.userService.findByEmail(loginDto.email);
    return user && user.comparePassword(loginDto.password);
  }

  createToken(user: any) {
    return {
      accessToken : this.jwtService.sign(user)
    };
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
      roles: ["plateverify", "admin"]
    };
    return await this.userService.create(superadmin);
  }

}
