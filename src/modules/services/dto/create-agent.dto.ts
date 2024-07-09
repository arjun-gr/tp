import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAgentsDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}
