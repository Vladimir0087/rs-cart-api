import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/models';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(name: string, password: string) {
    const user = await this.usersService.findUser('Vladimir');
    console.log("user---", user);
    if (user) {
      return user;
    }

    return this.usersService.createOne({ name, password })
  }

  login(user: User, type) {
    console.log("------login--------");
    const LOGIN_MAP = {
      jwt: this.loginJWT,
      basic: this.loginBasic,
      default: this.loginJWT,
    }
    const login = LOGIN_MAP[ type ]

    return login ? login(user) : LOGIN_MAP.default(user);
  }

  loginJWT(user: User) {
    console.log("------loginJWT--------");
    const payload = { username: user.name, sub: user.id };

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
    };
  }

  loginBasic(user: User) {
    // const payload = { username: user.name, sub: user.id };
    console.log("--------------", user);

    function encodeUserToken(user) {
      const { name, password } = user;
      const buf = Buffer.from([name, password].join(':'), 'utf8');

      return buf.toString('base64');
    }

    return {
      token_type: 'Basic',
      access_token: encodeUserToken(user),
    };
  }



}
