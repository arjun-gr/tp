import { MigrationInterface, QueryRunner } from 'typeorm';

export class AwarenessCamp1715769215720 implements MigrationInterface {
  name = 'AwarenessCamp1715769215720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`complaint_code\` varchar(50) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
