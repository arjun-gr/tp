import { MigrationInterface, QueryRunner } from 'typeorm';

export class AwarenessCamp1715604000363 implements MigrationInterface {
  name = 'AwarenessCamp1715604000363';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` DROP FOREIGN KEY \`FK_c6ede476bbef74d99c3e3c84c12\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` DROP COLUMN \`userId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`client_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`city_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`branch_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD CONSTRAINT \`FK_c5b0ab7817e6f40e5aa61a86c06\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD CONSTRAINT \`FK_8b0403556582b372d61e45c24e1\` FOREIGN KEY (\`city_id\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD CONSTRAINT \`FK_9e71d1b361e7fa80459eab4ce68\` FOREIGN KEY (\`branch_id\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
