import { MigrationInterface, QueryRunner } from 'typeorm';

export class Installproduct1713161012770 implements MigrationInterface {
  name = 'Installproduct1713161012770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`installed_product\` CHANGE \`fhu_qty\` \`fhu_qty\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`installed_product\` CHANGE \`install_fhu_qty\` \`install_fhu_qty\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`installed_product\` CHANGE \`fhu_invoice_amount\` \`fhu_invoice_amount\` decimal(10,2) NULL COMMENT 'female Hygiene unit invoice amount'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`installed_product\` CHANGE \`vm_machine_no\` \`vm_machine_no\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`installed_product\` CHANGE \`install_vm_qty\` \`install_vm_qty\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`installed_product\` CHANGE \`sim_number\` \`sim_number\` bigint NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
