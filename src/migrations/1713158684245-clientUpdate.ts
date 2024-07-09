import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdate1713158684245 implements MigrationInterface {
  name = 'ClientUpdate1713158684245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`branch\` DROP \`so_received_date\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
