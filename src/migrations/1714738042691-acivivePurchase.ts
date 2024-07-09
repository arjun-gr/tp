import { MigrationInterface, QueryRunner } from 'typeorm';

export class AcivivePurchase1714738042691 implements MigrationInterface {
  name = 'AcivivePurchase1714738042691';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`landfill_area_saved_liters\` \`landfill_area_saved_liters\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`carbon_equivalents_conserved_kg\` \`carbon_equivalents_conserved_kg\` decimal(10,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`total_complaints\` \`total_complaints\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`resolved_complaints\` \`resolved_complaints\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`pending_complaints\` \`pending_complaints\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`complaint_tat_time\` \`complaint_tat_time\` bigint NULL COMMENT 'TAT time in minutes'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`total_services\` \`total_services\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`completed_services\` \`completed_services\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`pending_services\` \`pending_services\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`no_of_bins\` \`no_of_bins\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`buyout_product\` \`buyout_product\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`no_of_monthly_services\` \`no_of_monthly_services\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`client\` \`client\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`branch\` \`branch\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` CHANGE \`city\` \`city\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
