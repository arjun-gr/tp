import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { File } from '../../../entities/file.entity';

export class CreateDocumentDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  soNumber: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  poNumber: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  purchaseOrderFileId: File;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  salesOrderFileId: File;
}
