import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Transform } from 'class-transformer';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { AnimeService } from './anime.service';
import { AnimeDto, AnimePosterDto, AnimeProfileDto } from './dto';

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

  // Edit anime profile
  @UseGuards(JwtGuard)
  @Post('/:animeId/profile')
  editAnimeProfile(
    @Param('animeId') animeId: number,
    @Body() dto: AnimeProfileDto,
  ) {
    return this.animeService.editAnimeProfile(animeId, dto);
  }

  @UseGuards(JwtGuard)
  @Post('/:animeId/poster')
  editAnimePoster(
    @Param('animeId') animeId: number,
    @Body() dto: AnimePosterDto,
  ) {
    return this.animeService.editAnimePoster(animeId, dto);
  }

  @Get()
  @Transform(({ value }) => new Date(value))
  findManyAnime(
    @Query('limit') limit: number,
    @Query('lastUpdate') lastUpdate: Date = new Date(),
  ) {
    return this.animeService.findManyAnime(limit, lastUpdate);
  }

  @Get(':animeId')
  findOneAnime(@Param('animeId') animeId: number) {
    return this.animeService.findOneAnimeById(animeId);
  }
}
