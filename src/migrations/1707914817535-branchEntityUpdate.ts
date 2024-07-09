import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchEntityUpdate1707914817535 implements MigrationInterface {
  name = 'BranchEntityUpdate1707914817535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`po_number\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`purchase_order\` \`purchase_order\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`sales_order\` \`sales_order\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
