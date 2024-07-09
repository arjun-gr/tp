import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { File } from '../../../entities/file.entity';
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDetailDto extends PartialType(CreateClientDto) {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  clientId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  branchId: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  logoId: File;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  clientType: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  industryType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  IFMClientId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  city: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  branchName: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  billingAddress: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  siteAddress: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pincode: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  gstNumber: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  femaleCount: number;
}
