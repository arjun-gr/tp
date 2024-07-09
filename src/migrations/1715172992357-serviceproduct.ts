import { MigrationInterface, QueryRunner } from 'typeorm';

export class Serviceproduct1715172992357 implements MigrationInterface {
  name = 'Serviceproduct1715172992357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_product\` CHANGE \`vm_machine_number\` \`vm_machine_number\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
