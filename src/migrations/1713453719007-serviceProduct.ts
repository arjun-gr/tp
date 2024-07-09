import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceProduct1713453719007 implements MigrationInterface {
  name = 'ServiceProduct1713453719007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_product\` ADD \`vm_machine_number\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
