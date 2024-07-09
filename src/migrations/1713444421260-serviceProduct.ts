import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceProduct1713444421260 implements MigrationInterface {
  name = 'ServiceProduct1713444421260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_product\` ADD \`pad_type\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
