import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketAndServicesTableUpdate1712297355520
  implements MigrationInterface
{
  name = 'TicketAndServicesTableUpdate1712297355520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`completed_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`completedBy\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`completed_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`completedBy\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_69dc34ad5b46a9e92d10281a7af\` FOREIGN KEY (\`completedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_f477b6cbc721e2032c4487fd0e5\` FOREIGN KEY (\`completedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
