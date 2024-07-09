import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdate1713429974488 implements MigrationInterface {
  name = 'ClientUpdate1713429974488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clients\` DROP COLUMN \`creation_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD \`industry_type\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD \`client_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` CHANGE \`logoId\` \`logoId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD CONSTRAINT \`FK_49e91f1e368e3f760789e7764aa\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
