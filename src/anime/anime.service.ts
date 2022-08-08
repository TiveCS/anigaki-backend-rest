import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnimeDto, AnimePosterDto, AnimeProfileDto } from './dto';

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

  async editAnimeProfile(animeId: number, dto: AnimeProfileDto) {
    try {
      const updatedProfile = await this.prisma.animeProfile.upsert({
        where: {
          id: animeId,
        },
        create: {
          ...dto,
        },
        update: {
          ...dto,
        },
      });
      return updatedProfile;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Anime is not found!');
        }
      }
    }
  }

  async editAnimePoster(animeId: number, dto: AnimePosterDto) {
    try {
      const updatedPoster = await this.prisma.animePoster.upsert({
        where: {
          id: animeId,
        },
        create: {
          ...dto,
        },
        update: {
          ...dto,
        },
      });

      return updatedPoster;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Anime is not found!');
        }
      }
      throw err;
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

  async findOneAnimeById(animeId: number) {
    try {
      const anime = await this.prisma.anime.findUnique({
        where: {
          id: animeId,
        },
        include: {
          animePoster: {
            select: {
              posterUrl: true,
            },
          },
          profile: {
            select: {
              altTitle: true,
              genres: true,
            },
          },
          epsiodes: {
            orderBy: {
              episodeNumber: 'desc',
            },
            select: {
              episodeNumber: true,
              download1080p: true,
              download720p: true,
              download480p: true,
              download360p: true,
            },
          },
        },
      });
      return anime;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Anime is not found!');
        }
      }
      throw err;
    }
  }
}
