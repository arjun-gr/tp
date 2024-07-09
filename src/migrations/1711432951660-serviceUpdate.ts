import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceUpdate1711432951660 implements MigrationInterface {
  name = 'ServiceUpdate1711432951660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`deployment_type\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
