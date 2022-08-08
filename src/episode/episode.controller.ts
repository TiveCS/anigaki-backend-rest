import { Body, Controller, Post } from '@nestjs/common';
import { EpisodeDto } from './dto';
import { EpisodeService } from './episode.service';

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  createEpisode(@Body() dto: EpisodeDto) {
    return this.episodeService.createEpisode(dto);
  }
}
