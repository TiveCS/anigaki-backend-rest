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

  // find anime by created at property in descending order
  @Get()
  @Transform(({ value }) => new Date(value))
  findManyAnime(
    @Query('limit') limit: number,
    @Query('lastUpdate') lastUpdate: Date = new Date(),
  ) {
    return this.animeService.findManyAnime(limit, lastUpdate);
  }
}
