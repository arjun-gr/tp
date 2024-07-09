import { MigrationInterface, QueryRunner } from 'typeorm';

export class CollateralVideoMigration1708931981531
  implements MigrationInterface
{
  name = 'CollateralVideoMigration1708931981531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD \`title\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD \`description\` text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
