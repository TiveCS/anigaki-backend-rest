import { Controller, Get, UseGuards } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('admins')
export class AdminController {
  @Get('me')
  getMe(@GetUser() user: Admin) {
    return user;
  }
}
