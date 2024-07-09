import { MigrationInterface, QueryRunner } from 'typeorm';

export class CostingFieldsTypeChanged1716903661302
  implements MigrationInterface
{
  name = 'CostingFieldsTypeChanged1716903661302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_product\` CHANGE \`vm_part_qty\` \`vm_part_qty\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
