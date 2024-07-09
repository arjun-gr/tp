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

export class CreateBlogDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  heroImage: File;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  teaserImage: File;

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
