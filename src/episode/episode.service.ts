import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EpisodeDto } from './dto';

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  async createEpisode(dto: EpisodeDto) {
    const {
      animeId,
      episodeNumber,
      download1080p,
      download720p,
      download480p,
      download360p,
    } = dto;

    try {
      const anime = await this.prisma.anime.findUnique({
        where: {
          id: animeId,
        },
        select: {
          id: true,
        },
      });

      if (!anime) throw new NotFoundException('Anime not found');

      const isEpisodeExists = await this.checkIfEpisodeExists(
        animeId,
        episodeNumber,
      );

      if (isEpisodeExists)
        throw new BadRequestException('Episode already exists');

      // Check if at least have one download link for this episode
      const isNoDownloadLink: boolean =
        !download1080p && !download720p && !download480p && !download360p;

      if (!isNoDownloadLink) {
        // create episode
        const episode = await this.prisma.episode.create({
          data: {
            ...dto,
          },
          select: {
            id: true,
            animeId: true,
            episodeNumber: true,
          },
        });
        return episode;
      } else {
        throw new BadRequestException(
          'Episode must have at least one download link',
        );
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Anime not found');
        }
      }
      throw err;
    }
  }

  async findAllEpisodes(animeId: number) {
    const episodes = await this.prisma.episode.findMany({
      where: {
        animeId,
      },
      orderBy: {
        episodeNumber: 'desc',
      },
    });

    return episodes;
  }

  async editEpisode(dto: EpisodeDto) {
    try {
      const { animeId, episodeNumber } = dto;

      const episode = await this.prisma.episode.findFirst({
        where: {
          animeId,
          AND: {
            episodeNumber,
          },
        },
        select: {
          id: true,
        },
      });

      if (!episode) throw new NotFoundException('Episode not found');

      const updatedEpisode = await this.prisma.episode.update({
        where: {
          id: episode.id,
        },
        data: {
          ...dto,
        },
      });

      return updatedEpisode;
    } catch (err) {
      throw err;
    }
  }

  async checkIfEpisodeExists(
    animeId: number,
    episodeNumber: number,
  ): Promise<boolean> {
    const episode = await this.prisma.episode.findFirst({
      where: {
        animeId,
        AND: {
          episodeNumber,
        },
      },
      select: {
        animeId: true,
        episodeNumber: true,
      },
    });

    if (!episode) return false;
    return true;
  }
}
