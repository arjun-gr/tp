import { MigrationInterface, QueryRunner } from 'typeorm';

export class CityEntityUpdate1712755000653 implements MigrationInterface {
  name = 'CityEntityUpdate1712755000653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cities\` CHANGE \`franchise\` \`franchise\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
