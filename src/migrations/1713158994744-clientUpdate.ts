import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdate1713158994744 implements MigrationInterface {
  name = 'ClientUpdate1713158994744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE \`branch\` DROP COLUMN \`fhu_product_type\``,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`branch\` DROP COLUMN \`fhu_quantity\``,
    // );

    // await queryRunner.query(
    //   `ALTER TABLE \`branch\` DROP COLUMN \`fhu_service_cost\``,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`branch\` DROP COLUMN \`fhu_service_type\``,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`branch\` DROP COLUMN \`vm_buyout_amount\``,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`branch\` DROP COLUMN \`vm_buyout_amount\``,
    // );

    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_rental_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_service_type\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
