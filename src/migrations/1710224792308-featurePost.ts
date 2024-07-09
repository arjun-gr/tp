import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeaturePost1710224792308 implements MigrationInterface {
  name = 'FeaturePost1710224792308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`is_feature\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
