import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceChanges1717134132066 implements MigrationInterface {
  name = 'ServiceChanges1717134132066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_product\` ADD \`refilling_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_product\` ADD \`refilling_amount\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
