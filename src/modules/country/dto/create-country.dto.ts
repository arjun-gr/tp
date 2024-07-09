import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  name: string;
}
