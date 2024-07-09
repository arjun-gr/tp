import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketByCityOpManagerDto {
  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  branchId: number;

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
  @IsOptional()
  product: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  bin: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  description: string;
}
