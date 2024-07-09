import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVideoTable1707295518673 implements MigrationInterface {
  name = 'CreateVideoTable1707295518673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`video\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`videoId\` int NOT NULL, UNIQUE INDEX \`REL_be09a9686413791bcbfdb2ca8c\` (\`videoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`video\` ADD CONSTRAINT \`FK_be09a9686413791bcbfdb2ca8c1\` FOREIGN KEY (\`videoId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`video\` DROP FOREIGN KEY \`FK_be09a9686413791bcbfdb2ca8c1\``,
    );

    await queryRunner.query(
      `DROP INDEX \`REL_be09a9686413791bcbfdb2ca8c\` ON \`video\``,
    );
    await queryRunner.query(`DROP TABLE \`video\``);
  }
}
