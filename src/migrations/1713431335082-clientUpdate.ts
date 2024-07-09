import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientUpdate1713431335082 implements MigrationInterface {
  name = 'ClientUpdate1713431335082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clients\` DROP FOREIGN KEY \`FK_49e91f1e368e3f760789e7764aa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` CHANGE \`client_id\` \`ifm_client_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD CONSTRAINT \`FK_e1bebf6b773e4826581b5857ff1\` FOREIGN KEY (\`ifm_client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
