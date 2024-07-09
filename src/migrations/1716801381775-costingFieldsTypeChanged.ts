import { MigrationInterface, QueryRunner } from 'typeorm';

export class CostingFieldsTypeChanged1716801381775
  implements MigrationInterface
{
  name = 'CostingFieldsTypeChanged1716801381775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`service_cost\` \`service_cost\` decimal(10,2) NULL COMMENT 'Service cost without gst per piece' DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`rental_amount\` \`rental_amount\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`buyout_amount\` \`buyout_amount\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`refilling_amount\` \`refilling_amount\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` CHANGE \`total_service_cost\` \`total_service_cost\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP COLUMN \`pad_cost\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`pad_cost\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`pads_collected\` \`pads_collected\` int NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`material_processed_kg\` \`material_processed_kg\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`landfill_area_saved_liters\` \`landfill_area_saved_liters\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`carbon_equivalents_conserved_kg\` \`carbon_equivalents_conserved_kg\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`total_complaints\` \`total_complaints\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`resolved_complaints\` \`resolved_complaints\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`pending_complaints\` \`pending_complaints\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`complaint_tat_time\` \`complaint_tat_time\` bigint NULL COMMENT 'TAT time in minutes' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`total_services\` \`total_services\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`completed_services\` \`completed_services\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`pending_services\` \`pending_services\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`no_of_bins\` \`no_of_bins\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`buyout_product\` \`buyout_product\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`no_of_monthly_services\` \`no_of_monthly_services\` bigint NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_product\` CHANGE \`invoice_amount\` \`invoice_amount\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_product\` CHANGE \`invoice_number\` \`invoice_number\` varchar(255) NULL`,
    );
    // await queryRunner.query(`ALTER TABLE \`service_product\` DROP COLUMN \`invoice_number\``);
    // await queryRunner.query(`ALTER TABLE \`service_product\` ADD \`invoice_number\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`service_product\` CHANGE \`pad_cost\` \`pad_cost\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    // await queryRunner.query(`ALTER TABLE \`service_product\` DROP COLUMN \`pad_cost\``);
    // await queryRunner.query(`ALTER TABLE \`service_product\` ADD \`pad_cost\` decimal(10,2) NULL DEFAULT '0.00'`);
    await queryRunner.query(
      `ALTER TABLE \`service_product\` CHANGE \`total_cost\` \`total_cost\` decimal(10,2) NULL DEFAULT '0.00'`,
    );
    // await queryRunner.query(`ALTER TABLE \`service_product\` DROP COLUMN \`total_cost\``);
    // await queryRunner.query(`ALTER TABLE \`service_product\` ADD \`total_cost\` decimal(10,2) NULL DEFAULT '0.00'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
