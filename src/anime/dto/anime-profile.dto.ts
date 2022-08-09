import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class AnimeProfileDto {
  @IsString()
  @IsOptional()
  altTitle?: string;

  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsOptional()
  genres?: string[];
}
