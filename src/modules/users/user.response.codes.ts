import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class UserResponseCodes extends AppResponseCodes {
  public static USER_NAME_ID_EXISTS: any = new BadRequestException(
    'user with userName already exists',
  );
  public static USER_EMAIL_ID_EXISTS: any = new BadRequestException(
    'user with email already exists',
  );

  public static USER_CONTACT_NUMBER_EXISTS: any = new BadRequestException(
    'user with contact number already exists',
  );

  public static USER_EMAIL_ALREADY_VERIFIED: any = new BadRequestException(
    'user email already verified',
  );

  public static TOKEN_EXPIRED: any = new BadRequestException('token expired');

  public static INVALID_TOKEN: any = new NotFoundException('token invalid');

  public static INVALID_USER_ID: any = new NotFoundException('invalid user id');

  public static INVALID_USER_ID_OR_PASSWORD: any = new NotFoundException(
    'invalid user id or password',
  );

  public static INVALID_PASSWORD: any = new NotFoundException(
    'invalid password',
  );

  public static INVALID_USER_EMAIL_ID: any = new NotFoundException(
    'invalid user email id',
  );

  public static CLIENT_CREATION_TYPE_NOT_EXISTS: any = new NotFoundException(
    'Client Creation Type Not Exists',
  );

  public static CLIENT_ENTRY_TYPE_NOT_EXISTS: any = new NotFoundException(
    'Client Entry Type Not Exists',
  );

  public static INVALID_BILLING_FREQUENCY: any = new NotFoundException(
    'Billing Frequency Not Found',
  );

  public static INVALID_PAYMENT_TERM: any = new NotFoundException(
    'Payment term Not Found',
  );

  public static INVALID_USER_TYPE: any = new NotFoundException(
    'Invalid user type',
  );

  public static INVALID_USER_JOB_TYPE: any = new NotFoundException(
    'Invalid user`s job type',
  );

  public static INVALID_USER_EMPLOYEE_TYPE: any = new NotFoundException(
    'Invalid user`s employee type',
  );

  public static INVALID_DIVISION_VALUE: any = new NotFoundException(
    'Invalid Division',
  );

  public static VM_PRODUCT_TYPE_NOT_EXISTS: any = new NotFoundException(
    'Invalid Vending Machine Product Type',
  );

  public static FHU_PRODUCT_TYPE_NOT_EXISTS: any = new NotFoundException(
    'Invalid Female Hygiene Unit Product Type',
  );

  public static CLIENT_NOT_EXISTS: any = new BadRequestException(
    'Client not exists',
  );

  public static PURCHASE_NOT_EXISTS: any = new BadRequestException(
    'ContractId not exists',
  );

  public static BRANCH_NOT_EXISTS: any = new BadRequestException(
    'Branch not exists',
  );

  public static USER_NOT_EXISTS: any = new BadRequestException(
    'User not exists',
  );
}
