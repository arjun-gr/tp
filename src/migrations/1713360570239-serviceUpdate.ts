import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceUpdate1713360570239 implements MigrationInterface {
  name = 'ServiceUpdate1713360570239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`service_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`total_quantity\` int NULL, \`installed_quantity\` int NULL, \`serviced_quantity\` int NULL, \`service_type\` varchar(50) NULL, \`service_frequency\` varchar(50) NULL, \`invoice_amount\` decimal(10,2) NULL, \`is_invoice_submitted\` varchar(50) NULL, \`invoice_other_detail\` varchar(255) NULL, \`invoice_number\` int NULL, \`5_rs_pad_ref_quantity\` int NULL, \`10_rs_pad_ref_quantity\` int NULL, \`5_rs_coin_coll_quantity\` int NULL, \`10_rs_coin_coll_quantity\` int NULL, \`5_rs_pad_sold_quantity\` int NULL, \`10_rs_pad_sold_quantity\` int NULL, \`pad_sold_invoice_amount\` decimal(10,2) NULL, \`sim_brand\` varchar(50) NULL, \`sim_number\` bigint NULL, \`sim_recharge_price\` int NULL, \`pad_brand\` varchar(50) NULL, \`pad_quantity\` bigint NULL, \`pad_cost\` bigint NULL, \`total_cost\` bigint NULL, \`serviceId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
