import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AnimeProfileDto {
  @IsNumber()
  @IsNotEmpty()
  animeId: number;

  @IsString()
  @IsOptional()
  altTitle?: string;

  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsOptional()
  genres?: string[];
}
