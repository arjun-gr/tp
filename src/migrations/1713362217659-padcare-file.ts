import { MigrationInterface, QueryRunner } from 'typeorm';

export class PadcareFile1713362217659 implements MigrationInterface {
  name = 'PadcareFile1713362217659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD \`serviceId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_e38636d9b3b2b730c2e5dd3758a\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
