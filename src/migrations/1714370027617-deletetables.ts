import { MigrationInterface, QueryRunner } from 'typeorm';

export class Deletetables1714370027617 implements MigrationInterface {
  name = 'Deletetables1714370027617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`fhu_product_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`fhu_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`fhu_service_cost\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`fhu_service_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_buyout_amount\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
