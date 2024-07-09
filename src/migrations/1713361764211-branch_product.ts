import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchProduct1713361764211 implements MigrationInterface {
  name = 'BranchProduct1713361764211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`pad_quantity\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`pad_cost\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`pad_type\` varchar(50) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`quantity\` \`quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`service_type\` \`service_type\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`deployment_type\` \`deployment_type\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`service_cost\` \`service_cost\` decimal(10,2) NULL COMMENT 'Service cost without gst per piece'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`rental_amount\` \`rental_amount\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`buyout_amount\` \`buyout_amount\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`refilling_quantity\` \`refilling_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`refilling_amount\` \`refilling_amount\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`status\` \`status\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`total_service_cost\` \`total_service_cost\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`terminate_at\` \`terminate_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`terminate_reason\` \`terminate_reason\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`installation_date\` \`installation_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`simCardBrand\` \`simCardBrand\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`sim_recharge_price\` \`sim_recharge_price\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`sanitary_pad_brand\` \`sanitary_pad_brand\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`purchaseId\` \`purchaseId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`productId\` \`productId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`branchId\` \`branchId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`terminated_by\` \`terminated_by\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
