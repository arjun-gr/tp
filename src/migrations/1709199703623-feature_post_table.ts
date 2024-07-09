import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeaturePostTable1709199703623 implements MigrationInterface {
  name = 'FeaturePostTable1709199703623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`feature_post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`thumbnailId\` int NULL, UNIQUE INDEX \`REL_f3855b779989a86a6150ee571a\` (\`thumbnailId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD \`is_feature_post\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` ADD \`is_feature_post\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD \`is_feature_post\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
