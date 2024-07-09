import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceDate1715171295272 implements MigrationInterface {
  name = 'ServiceDate1715171295272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`service_at\` date NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
