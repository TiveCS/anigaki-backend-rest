import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { EpisodeDto } from './dto';
import { EpisodeService } from './episode.service';

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @UseGuards(JwtGuard)
  @Post()
  createEpisode(@Body() dto: EpisodeDto) {
    return this.episodeService.createEpisode(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':animeId')
  findAllEpisodes(@Param('animeId') animeId: number) {
    return this.episodeService.findAllEpisodes(animeId);
  }

  @UseGuards(JwtGuard)
  @Put()
  editEpisode(@Body() dto: EpisodeDto) {
    return this.episodeService.editEpisode(dto);
  }
}
