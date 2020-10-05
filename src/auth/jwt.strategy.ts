import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SchoolService } from 'src/school/school.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly authService: AuthService,
    private readonly schoolService: SchoolService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any, done: Function) {
    let user = await this.authService.checkToken(payload);

    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    if (user.schoolId) {
      const school = await this.schoolService.findById(user.schoolId);
      user.school = school;
    }

    done(null, user);
  }
}
