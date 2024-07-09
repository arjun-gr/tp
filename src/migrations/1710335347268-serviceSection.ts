import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceSection1710335347268 implements MigrationInterface {
  name = 'ServiceSection1710335347268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`installed_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`fhu_qty\` int NOT NULL, \`install_fhu_qty\` int NOT NULL, \`fhu_invoice_amount\` decimal(10,2) NOT NULL COMMENT 'female Hygiene unit invoice amount', \`vm_machine_no\` int NOT NULL, \`install_vm_qty\` int NOT NULL, \`sim_type\` varchar(50) NULL, \`sim_number\` bigint NOT NULL, \`vm_invoice_amount\` decimal(10,2) NOT NULL COMMENT 'Vending Machine invoice amount', \`serviceId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`rescheduleDate\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`fhu_bin_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`fhu_invoice_amount\` decimal(10,2) NULL COMMENT 'invoice amount without gst'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`vm_service_type\` varchar(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`vm_service_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`5_rs_pad_ref_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`10_rs_pad_ref_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`5_rs_coin_coll_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`10_rs_coin_coll_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`5_rs_pad_sold_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`10_rs_pad_sold_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`waste_pad_collection\` int NULL COMMENT 'Waste pad collection quantity in gram'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`pad_sold_invoice_amount\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`total_service_cost\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`reschedule_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`client_onboarding_product\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`stickers\` varchar(255) NULL`,
    );
    // await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`creation_type\` \`creation_type\` varchar(50) NOT NULL`);
    // await queryRunner.query(`ALTER TABLE \`purchase\` ADD UNIQUE INDEX \`IDX_b227c1b2739dd8d088edb00cef\` (\`email_confirmation\`)`);

    // await queryRunner.query(`ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_b227c1b2739dd8d088edb00cef2\` FOREIGN KEY (\`email_confirmation\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(
      `ALTER TABLE \`installed_product\` ADD CONSTRAINT \`FK_3d70f7844bee76722952d83c639\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`installed_product\` ADD CONSTRAINT \`FK_bd24579dfcdb561e0759fcfcebb\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
