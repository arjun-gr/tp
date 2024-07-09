import { MigrationInterface, QueryRunner } from 'typeorm';

export class AcivivePurchase1709792871962 implements MigrationInterface {
  name = 'AcivivePurchase1709792871962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD \`activePurchaseId\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_54c8ed439e70148dfb2564f5d4f\` FOREIGN KEY (\`activePurchaseId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`purchase\` DROP COLUMN \`activePurchaseId\``,
    );
  }
}
