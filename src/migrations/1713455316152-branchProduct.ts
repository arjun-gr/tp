import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchProduct1713455316152 implements MigrationInterface {
  name = 'BranchProduct1713455316152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`sim_number\` varchar(15) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
