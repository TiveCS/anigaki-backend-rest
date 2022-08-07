import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('admins')
export class AdminController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const { user } = req;

    return user;
  }
}
