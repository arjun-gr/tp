import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeaturePostUpdate21709562221252 implements MigrationInterface {
  name = 'FeaturePostUpdate21709562221252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`published_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`published_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_d02c42482722e13f3b3459c743e\` FOREIGN KEY (\`published_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` CHANGE \`type\` \`type\` varchar(50) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
