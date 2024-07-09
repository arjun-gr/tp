import { MigrationInterface, QueryRunner } from 'typeorm';

export class PadcareFiles1713432346113 implements MigrationInterface {
  name = 'PadcareFiles1713432346113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` DROP COLUMN \`entityId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` DROP COLUMN \`entityType\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD \`branchProductId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD \`serviceProductId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_a8fd22297c356300e31765e675f\` FOREIGN KEY (\`branchProductId\`) REFERENCES \`branch_product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_044dae64376407a41984de512c2\` FOREIGN KEY (\`serviceProductId\`) REFERENCES \`service_product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
