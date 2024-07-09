import { MigrationInterface, QueryRunner } from 'typeorm';

export class AcivivePurchase1716357377864 implements MigrationInterface {
  name = 'AcivivePurchase1716357377864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ticket\` CHANGE \`subject\` \`subject\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
