import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TicketStatus } from '../../../common/enums/ticket-status';
import { TicketType } from '../../../common/enums/ticket-type';

export class CreateTicketDto {
  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  clientId: Number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  branchId: Number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  cityId: number;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  type: TicketType;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
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

  @ApiProperty({ enum: TicketStatus })
  @IsNotEmpty()
  ticket_status: TicketStatus = TicketStatus.PLANNED;

  // @ApiProperty({ type: String })
  // @IsString()
  // @IsNotEmpty()
  // priority: TicketPriority = TicketPriority.NOT_URGENT;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsArray()
  @IsOptional()
  images: File[];
}
