import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchProduct1710417206992 implements MigrationInterface {
  name = 'BranchProduct1710417206992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`installation_date\` date NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
