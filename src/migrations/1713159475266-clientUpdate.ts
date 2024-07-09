import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdate1713159475266 implements MigrationInterface {
  name = 'ClientUpdate1713159475266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_product_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_refilling_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_refilling_quantity\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
