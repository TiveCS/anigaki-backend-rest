import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: AuthDto) {
    const { username, password } = dto;

    const hash = await argon.hash(password);

    try {
      const admin = await this.prisma.admin.create({
        data: {
          username,
          password: hash,
        },
      });

      return await this.signToken(admin.id, admin.username);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Crendentials taken!');
        }
      }
    }
  }

  async login(dto: AuthDto) {
    const { username, password } = dto;

    const admin = await this.prisma.admin.findUnique({
      where: {
        username,
      },
    });

    if (!admin) throw new ForbiddenException('Credentials not found!');

    const isValid = await argon.verify(admin.password, password);

    if (!isValid) throw new ForbiddenException('Credentials is invalid!');

    return await this.signToken(admin.id, admin.username);
  }

  async signToken(
    adminId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: adminId,
      username,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
