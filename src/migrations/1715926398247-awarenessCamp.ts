import { MigrationInterface, QueryRunner } from 'typeorm';

export class AwarenessCamp1715926398247 implements MigrationInterface {
  name = 'AwarenessCamp1715926398247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_product\` CHANGE \`sim_number\` \`sim_number\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
