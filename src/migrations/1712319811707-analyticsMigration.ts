import { MigrationInterface, QueryRunner } from 'typeorm';

export class AnalyticsMigration1712319811707 implements MigrationInterface {
  name = 'AnalyticsMigration1712319811707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`total_complaints\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`resolved_complaints\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`pending_complaints\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`complaint_tat_time\` bigint NULL COMMENT 'TAT time in minutes'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`total_services\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`completed_services\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`pending_services\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`no_of_bins\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`buyout_product\` bigint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD \`no_of_monthly_services\` bigint NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`analytics\` ADD \`city\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD CONSTRAINT \`FK_44937194192c974bdf53d4012fd\` FOREIGN KEY (\`city\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
