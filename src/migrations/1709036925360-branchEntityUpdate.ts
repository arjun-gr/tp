import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchEntityUpdate1709036925360 implements MigrationInterface {
  name = 'BranchEntityUpdate1709036925360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`billing_addr_pincode\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`site_addr_pincode\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
