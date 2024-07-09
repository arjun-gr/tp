import { MigrationInterface, QueryRunner } from 'typeorm';

export class Service1713768008429 implements MigrationInterface {
  name = 'Service1713768008429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`other_vehicle_used\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
