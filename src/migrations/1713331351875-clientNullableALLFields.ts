import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientNullableALLFields1713331351875
  implements MigrationInterface
{
  name = 'ClientNullableALLFields1713331351875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`name\` \`name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`billing_address\` \`billing_address\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`site_address\` \`site_address\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`pincode\` \`pincode\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`gst_number\` \`gst_number\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`female_count\` \`female_count\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`contract_start_date\` \`contract_start_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`contract_end_date\` \`contract_end_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`contract_period\` \`contract_period\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`sales_lead\` \`sales_lead\` varchar(150) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`city_id\` \`city_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`client_id\` \`client_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`userId\` \`userId\` int NULL`,
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

    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`type\` \`type\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`status\` \`status\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`installation_date\` \`installation_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`so_number\` \`so_number\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`po_number\` \`po_number\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`payment_terms\` \`payment_terms\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`billing_faq\` \`billing_faq\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`so_received_date\` \`so_received_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`contract_start_date\` \`contract_start_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`contract_end_date\` \`contract_end_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`branchId\` \`branchId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`activePurchaseId\` \`activePurchaseId\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`spocs\` CHANGE \`email\` \`email\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`spocs\` CHANGE \`phoneNumber\` \`phoneNumber\` varchar(13) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`spocs\` CHANGE \`branchId\` \`branchId\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
