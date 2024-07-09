import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketUpdate1711612191481 implements MigrationInterface {
  name = 'ticketUpdate1711612191481';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`product\``);
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`bin\``);
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`vending_machine_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`fhu_bin_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_43b593bbf2cee606ac21e9e6592\` FOREIGN KEY (\`vending_machine_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_3b62604b0f7f1c08e1b55697468\` FOREIGN KEY (\`fhu_bin_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
