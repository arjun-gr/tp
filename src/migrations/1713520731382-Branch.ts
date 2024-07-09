import { MigrationInterface, QueryRunner } from 'typeorm';

export class Branch1713520731382 implements MigrationInterface {
  name = 'Branch1713520731382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP COLUMN \`terminate_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP COLUMN \`terminate_reason\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP FOREIGN KEY \`FK_a3ad8ea1c11af3249c298662af3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP COLUMN \`terminated_by\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP COLUMN \`installation_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` DROP COLUMN \`simCardBrand\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`sim_brand\` varchar(50) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`deactivated_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`deactivate_reason\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`deactivated_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_b489494876fdb72440c95584115\` FOREIGN KEY (\`deactivated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`delete_reason\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`deleted_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_dba7609b54cd8a8f51242af62ea\` FOREIGN KEY (\`deleted_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD \`deactivated_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD \`deactivate_reason\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD \`deactivated_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_35737f0edaea50b4492a535a2a1\` FOREIGN KEY (\`deactivated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
