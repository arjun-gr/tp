import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchProduct1713271795019 implements MigrationInterface {
  name = 'BranchProduct1713271795019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP COLUMN \`expected_cost\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP COLUMN \`actual_cost\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`total_service_cost\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`service_cost\` \`service_cost\` decimal(10,2) NULL COMMENT 'Service cost without gst per piece'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
