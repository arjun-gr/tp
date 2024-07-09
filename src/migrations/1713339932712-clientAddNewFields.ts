import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientAddNewFields1713339932712 implements MigrationInterface {
  name = 'ClientAddNewFields1713339932712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`simCardBrand\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`sim_recharge_price\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`sanitary_pad_brand\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
