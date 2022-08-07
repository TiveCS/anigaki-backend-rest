import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: AuthDto) {
    const admin = await this.prisma.admin.create({
      data: {
        ...dto,
      },
    });

    return admin;
  }
}