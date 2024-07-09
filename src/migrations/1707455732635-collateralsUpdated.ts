import { MigrationInterface, QueryRunner } from 'typeorm';

export class CollateralsUpdated1707455732635 implements MigrationInterface {
  name = 'CollateralsUpdated1707455732635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP FOREIGN KEY \`FK_24e53ddd3693aec36e395fa67b9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP FOREIGN KEY \`FK_f8ed2e882a38131441b2c860d85\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_24e53ddd3693aec36e395fa67b\` ON \`collaterals\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_f8ed2e882a38131441b2c860d8\` ON \`collaterals\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP COLUMN \`imageId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP COLUMN \`pdfId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD \`collateralFileId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD UNIQUE INDEX \`IDX_ee8fc0afca9853a6ac7ba9426f\` (\`collateralFileId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_ee8fc0afca9853a6ac7ba9426f\` ON \`collaterals\` (\`collateralFileId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD CONSTRAINT \`FK_ee8fc0afca9853a6ac7ba9426f9\` FOREIGN KEY (\`collateralFileId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP FOREIGN KEY \`FK_ee8fc0afca9853a6ac7ba9426f9\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_ee8fc0afca9853a6ac7ba9426f\` ON \`collaterals\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP INDEX \`IDX_ee8fc0afca9853a6ac7ba9426f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP COLUMN \`collateralFileId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD \`pdfId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD \`imageId\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_f8ed2e882a38131441b2c860d8\` ON \`collaterals\` (\`pdfId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_24e53ddd3693aec36e395fa67b\` ON \`collaterals\` (\`imageId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD CONSTRAINT \`FK_f8ed2e882a38131441b2c860d85\` FOREIGN KEY (\`pdfId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD CONSTRAINT \`FK_24e53ddd3693aec36e395fa67b9\` FOREIGN KEY (\`imageId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
