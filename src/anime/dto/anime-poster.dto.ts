import { IsNotEmpty, IsUrl } from 'class-validator';

export class AnimePosterDto {
  @IsUrl()
  @IsNotEmpty()
  posterUrl: string;
}
