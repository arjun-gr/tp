import { MigrationInterface, QueryRunner } from 'typeorm';

export class PurchaseEntityUpdate1710491952215 implements MigrationInterface {
  name = 'PurchaseEntityUpdate1710491952215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP FOREIGN KEY \`FK_b25845ef40a87fe9a8c440208b1\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP FOREIGN KEY \`FK_96d322b407099698242fdc6fa69\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP FOREIGN KEY \`FK_5f4e80b354912104d8d33f71ffe\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP FOREIGN KEY \`FK_54bba1e39821c2d83461f2d1bc5\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP COLUMN \`purchase_order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP COLUMN \`sales_order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP COLUMN \`agreementId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP COLUMN \`work_authorization_letter\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP COLUMN \`email_confirmation\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
