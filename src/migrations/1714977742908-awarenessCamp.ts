import { MigrationInterface, QueryRunner } from 'typeorm';

export class AwarenessCamp1714977742908 implements MigrationInterface {
  name = 'AwarenessCamp1714977742908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`createdBy\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD CONSTRAINT \`FK_549f566bfeddc7aed9e8b7112ec\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
