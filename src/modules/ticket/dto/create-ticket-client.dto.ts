import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { File } from '../../../entities/file.entity';
export class CreateTicketByClientDto {
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsOptional()
  product: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsOptional()
  bin: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsArray()
  @IsOptional()
  images: File[];
}
