import { MigrationInterface, QueryRunner } from 'typeorm';

export class Purchase1714027831496 implements MigrationInterface {
  name = 'Purchase1714027831496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` CHANGE \`division\` \`division\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` CHANGE \`jobType\` \`jobType\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
