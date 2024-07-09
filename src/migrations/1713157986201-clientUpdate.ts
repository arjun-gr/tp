import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdate1713157986201 implements MigrationInterface {
  name = 'ClientUpdate1713157986201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clients\` DROP COLUMN \`entry_type\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
