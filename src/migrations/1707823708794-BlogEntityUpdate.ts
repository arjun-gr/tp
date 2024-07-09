import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1707823708794 implements MigrationInterface {
  name = 'Initial1707823708794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD \`published_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD \`published_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_16bcfece12b1cdb8f29df66b9cf\` FOREIGN KEY (\`published_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
