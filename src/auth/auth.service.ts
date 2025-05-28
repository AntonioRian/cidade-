import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';
import { HashPassword } from 'src/common/utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(undefined, email);
    const authorization = await HashPassword.comparePassword(
      pass,
      user.password,
    );

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.email, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
