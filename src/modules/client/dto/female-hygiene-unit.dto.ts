import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, isInt, isNumber } from 'class-validator';
import { ServiceType } from 'src/common/enums/services';

export class CreateFemaleHygieneUnitDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  branchProductId: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  productId: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity: number = null;

  @ApiProperty({ type: String })
  @IsEnum(ServiceType)
  @Transform((param) => (param.value == '' ? null : param.value))
  @IsString()
  serviceType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  serviceCost: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  totalServiceCost: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  installedQuantity: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  servicedQuantity: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  invoiceAmount: number = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  isInvoiceSubmitted: string = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @Transform((param) => (param.value == '' ? null : param.value))
  @IsString()
  @IsOptional()
  invoiceOther: string = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @Transform((param) => (param.value == '' ? null : param.value))
  @IsString()
  @IsOptional()
  invoiceNumber: string = null;
}
