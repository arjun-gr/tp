import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceSection221710411126865 implements MigrationInterface {
  name = 'ServiceSection221710411126865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` CHANGE \`fileId\` \`file_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD UNIQUE INDEX \`IDX_eb25bb48c8559d3ec15c792679\` (\`file_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_eb25bb48c8559d3ec15c7926793\` FOREIGN KEY (\`file_id\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
