import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlogTable1707306165823 implements MigrationInterface {
  name = 'CreateBlogTable1707306165823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`blog\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`content\` longtext COLLATE "utf8mb4_unicode_520_ci" NOT NULL, \`heroImageId\` int NOT NULL, \`teaserImageId\` int NOT NULL, UNIQUE INDEX \`REL_798594bc5627446740807ed949\` (\`heroImageId\`), UNIQUE INDEX \`REL_a59d4de9020a0f52f293280577\` (\`teaserImageId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_798594bc5627446740807ed9499\` FOREIGN KEY (\`heroImageId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_a59d4de9020a0f52f2932805775\` FOREIGN KEY (\`teaserImageId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_a59d4de9020a0f52f2932805775\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_798594bc5627446740807ed9499\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_a59d4de9020a0f52f293280577\` ON \`blog\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_798594bc5627446740807ed949\` ON \`blog\``,
    );
    await queryRunner.query(`DROP TABLE \`blog\``);
  }
}
