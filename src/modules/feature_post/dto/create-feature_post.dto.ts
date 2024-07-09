import { ApiProperty } from '@nestjs/swagger';
import { File } from 'multer';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFeaturePostDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  link: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  thumbnailId: File;

  @ApiProperty({ type: Boolean })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  published: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isFeature: boolean;
}
