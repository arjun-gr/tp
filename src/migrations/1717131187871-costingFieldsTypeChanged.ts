import { MigrationInterface, QueryRunner } from 'typeorm';

export class CostingFieldsTypeChanged1717131187871
  implements MigrationInterface
{
  name = 'CostingFieldsTypeChanged1717131187871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`invoice_amount\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
