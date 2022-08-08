import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class AnimePosterDto {
  @IsNumber()
  @IsNotEmpty()
  animeId: number;

  @IsUrl()
  @IsNotEmpty()
  posterUrl: string;
}
