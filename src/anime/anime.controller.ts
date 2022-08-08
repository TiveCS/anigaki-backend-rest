import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { AnimeService } from './anime.service';
import { AnimeDto } from './dto';

@Controller('animes')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @UseGuards(JwtGuard)
  @Post()
  postAnime(@Body() dto: AnimeDto, @GetUser('id') postedBy: number) {
    return this.animeService.postAnime(dto, postedBy);
  }

  @UseGuards(JwtGuard)
  @Delete('/:animeId')
  deleteAnime(@Param('animeId') animeId: number) {
    return this.animeService.deleteAnime(animeId);
  }
}
