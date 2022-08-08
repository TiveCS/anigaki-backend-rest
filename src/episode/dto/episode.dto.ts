import { IsNotEmpty, IsNumber, IsOptional, IsUrl, Min } from 'class-validator';

export class EpisodeDto {
  @IsNumber()
  @IsNotEmpty()
  animeId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  episodeNumber: number;

  @IsUrl()
  @IsOptional()
  download1080p?: string;

  @IsUrl()
  @IsOptional()
  download720p?: string;

  @IsUrl()
  @IsOptional()
  download480p?: string;

  @IsUrl()
  @IsOptional()
  download360p?: string;
}
