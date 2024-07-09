import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchFHUServiceType1707746539715 implements MigrationInterface {
  name = 'BranchFHUServiceType1707746539715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`fhu_service_type\` \`fhu_service_type\` enum ('Weekly', '10 Days', 'Fortnightly', 'Monthly') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
