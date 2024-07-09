import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveEnums1708604820802 implements MigrationInterface {
  name = 'RemoveEnums1708604820802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` DROP COLUMN \`emp_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`emp_type\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`status\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` DROP COLUMN \`clientStatus\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD \`clientStatus\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`product\``);
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`product\` varchar(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`bin\``);
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`bin\` varchar(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`priority\``);
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`priority\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`type\``);
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD \`type\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`clients\` DROP COLUMN \`entry_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD \`entry_type\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`clients\` DROP COLUMN \`creation_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD \`creation_type\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` ADD \`type\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` DROP COLUMN \`division\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` ADD \`division\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` DROP COLUMN \`jobType\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` ADD \`jobType\` varchar(50) NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE \`cities\` DROP COLUMN \`tier\``);
    await queryRunner.query(
      `ALTER TABLE \`cities\` ADD \`tier\` varchar(20) NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE \`cities\` DROP COLUMN \`franchise\``);
    await queryRunner.query(
      `ALTER TABLE \`cities\` ADD \`franchise\` varchar(50) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
