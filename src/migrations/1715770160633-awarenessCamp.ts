import { MigrationInterface, QueryRunner } from 'typeorm';

export class AwarenessCamp1715770160633 implements MigrationInterface {
  name = 'AwarenessCamp1715770160633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`number\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
