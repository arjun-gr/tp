import { MigrationInterface, QueryRunner } from 'typeorm';

export class AwarenessCamp1715664732584 implements MigrationInterface {
  name = 'AwarenessCamp1715664732584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` DROP FOREIGN KEY \`FK_549f566bfeddc7aed9e8b7112ec\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` DROP COLUMN \`createdBy\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`created_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`completed_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD CONSTRAINT \`FK_27f2df70fcb4849134c7919e50e\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD CONSTRAINT \`FK_8f889b01cb5e8cbfe974dce6752\` FOREIGN KEY (\`completed_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
