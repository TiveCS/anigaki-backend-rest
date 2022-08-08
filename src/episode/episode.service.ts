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
      });

      if (!anime) throw new NotFoundException('Anime not found');

      const isEpisodeExists = await this.checkIfEpisodeExists(
        animeId,
        episodeNumber,
      );

      if (isEpisodeExists)
        throw new BadRequestException('Episode already exists');

      // Check if at least have one download link of any video quality for this episode
      const hasDownloadLink =
        !download1080p || !download720p || !download480p || !download360p;

      if (hasDownloadLink) {
        // create episode
        const episode = await this.prisma.episode.create({
          data: {
            ...dto,
          },
        });
        return episode;
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
    });

    if (!episode) return false;
    return true;
  }
}
