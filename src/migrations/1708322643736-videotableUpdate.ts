import { MigrationInterface, QueryRunner } from 'typeorm';

export class VideotableUpdate1708322643736 implements MigrationInterface {
  name = 'VideotableUpdate1708322643736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD \`thumbnailId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD CONSTRAINT \`FK_1adf3c18a8d7b082ac244309039\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
