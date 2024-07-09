import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdate1713158147834 implements MigrationInterface {
  name = 'ClientUpdate1713158147834';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE \`branch\` DROP COLUMN \`so_received_date\``);
    await queryRunner.query(
      `ALTER TABLE \`purchase\` CHANGE \`so_received_date\` \`so_received_date\` date NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
