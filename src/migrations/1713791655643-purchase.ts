import { MigrationInterface, QueryRunner } from 'typeorm';

export class Purchase1713791655643 implements MigrationInterface {
  name = 'Purchase1713791655643';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD \`deleted_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD \`delete_reason\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_82dd8f62092fcb6cb7c31470590\` FOREIGN KEY (\`deleted_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
