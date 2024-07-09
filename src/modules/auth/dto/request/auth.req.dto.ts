import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';
import { REGEX } from 'src/utils/app.utils';

export class AuthReqDto {
  @ApiProperty({
    description: 'The email which was used for registration',
    type: 'string',
  })
  userName: string;

  @Length(6, 12)
  @Matches(REGEX.PASSWORD, {
    message:
      'Password must be 6 - 12 characters long with 1 upper case, 1 lowercase and 1 number or special character',
  })
  @ApiProperty({
    description: 'The password which was mentioned during registration.',
    type: 'string',
  })
  password: string;
}
