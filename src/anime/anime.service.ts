import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnimeDto } from './dto';

@Injectable()
export class AnimeService {
  constructor(private prisma: PrismaService) {}

  async postAnime(dto: AnimeDto, postedBy: number) {
    try {
      const anime = await this.prisma.anime.create({
        data: {
          ...dto,
          postedBy,
        },
      });
      return anime;
    } catch (err) {
      throw err;
    }
  }

  async deleteAnime(animeId: number) {
    try {
      const anime = await this.prisma.anime.delete({
        where: {
          id: animeId,
        },
        select: {
          id: true,
          title: true,
        },
      });
      return anime;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Anime is not found!');
        }
        throw err;
      }
    }
  }

  async findManyAnime(limit: number, lastUpdate: Date) {
    try {
      const animes = await this.prisma.anime.findMany({
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
        where: {
          updatedAt: {
            lte: lastUpdate,
          },
        },
        select: {
          id: true,
          title: true,
          epsiodes: {
            take: 1,
            orderBy: {
              episodeNumber: 'desc',
            },
            select: {
              episodeNumber: true,
            },
          },
          animePoster: {
            select: {
              posterUrl: true,
            },
          },
        },
      });
      return animes;
    } catch (err) {
      throw err;
    }
  }
}
