import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAnalyticTable1709185013016 implements MigrationInterface {
  name = 'UpdateAnalyticTable1709185013016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`analytics\` DROP COLUMN \`material_processed_kg\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`material_processed_kg\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` DROP COLUMN \`landfill_area_saved_liters\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`landfill_area_saved_liters\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` DROP COLUMN \`carbon_equivalents_conserved_kg\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`carbon_equivalents_conserved_kg\` decimal(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`analytics\` DROP COLUMN \`carbon_equivalents_conserved_kg\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`carbon_equivalents_conserved_kg\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` DROP COLUMN \`landfill_area_saved_liters\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`landfill_area_saved_liters\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` DROP COLUMN \`material_processed_kg\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`material_processed_kg\` int NOT NULL`,
    );
  }
}
