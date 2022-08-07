import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
      return admin;
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

    return {
      message: 'Welcome!',
    };
  }
}
