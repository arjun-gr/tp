import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceProduct1713505965529 implements MigrationInterface {
  name = 'ServiceProduct1713505965529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`bin_maintenace_other_part\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_product\` ADD \`vm_maintenance_part\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_product\` ADD \`vm_maintenance_other_part\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_product\` ADD \`vm_part_qty\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
