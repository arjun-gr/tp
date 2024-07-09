import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1715239106766 implements MigrationInterface {
  name = 'Notifications1715239106766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`cancelled_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`type\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
