import { MigrationInterface, QueryRunner } from 'typeorm';

export class Branch1713613387116 implements MigrationInterface {
  name = 'Branch1713613387116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`sim_number\` \`sim_number\` varchar(15) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
