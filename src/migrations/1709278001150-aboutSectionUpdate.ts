import { MigrationInterface, QueryRunner } from 'typeorm';

export class AboutSectionUpdate1709278001150 implements MigrationInterface {
  name = 'AboutSectionUpdate1709278001150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD \`published_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD \`published_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD \`published_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD \`published_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD CONSTRAINT \`FK_08fac1956357ae75e95a64023c5\` FOREIGN KEY (\`published_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD CONSTRAINT \`FK_9864bd7d307c18eb4645b74fc09\` FOREIGN KEY (\`published_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
