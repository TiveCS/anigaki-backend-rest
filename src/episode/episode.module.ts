import { Module } from '@nestjs/common';
import { EpisodeController } from './episode.controller';

@Module({
  controllers: [EpisodeController]
})
export class EpisodeModule {}
