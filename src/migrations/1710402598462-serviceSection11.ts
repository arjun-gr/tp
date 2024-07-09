import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceSection111710402598462 implements MigrationInterface {
  name = 'ServiceSection111710402598462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD \`installation_date\` date NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
