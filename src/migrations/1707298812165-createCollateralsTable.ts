import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCollateralsTable1707298812165 implements MigrationInterface {
  name = 'CreateCollateralsTable1707298812165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`collaterals\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`imageId\` int NOT NULL, \`pdfId\` int NOT NULL, UNIQUE INDEX \`REL_24e53ddd3693aec36e395fa67b\` (\`imageId\`), UNIQUE INDEX \`REL_f8ed2e882a38131441b2c860d8\` (\`pdfId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD CONSTRAINT \`FK_24e53ddd3693aec36e395fa67b9\` FOREIGN KEY (\`imageId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD CONSTRAINT \`FK_f8ed2e882a38131441b2c860d85\` FOREIGN KEY (\`pdfId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP FOREIGN KEY \`FK_f8ed2e882a38131441b2c860d85\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` DROP FOREIGN KEY \`FK_24e53ddd3693aec36e395fa67b9\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_f8ed2e882a38131441b2c860d8\` ON \`collaterals\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_24e53ddd3693aec36e395fa67b\` ON \`collaterals\``,
    );
    await queryRunner.query(`DROP TABLE \`collaterals\``);
  }
}
