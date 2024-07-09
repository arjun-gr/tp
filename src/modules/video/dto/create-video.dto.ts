import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { File } from '../../../entities/file.entity';

export class CreateVideoDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  videoId: File;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  thumbnailId: File;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: Boolean, default: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isFeature: boolean;

  @ApiProperty({ type: Boolean })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  published: boolean;
}
