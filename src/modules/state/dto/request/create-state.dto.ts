import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Country } from '../../../../entities/country.entity';

export class CreateStateDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  country: Country;
}
