import { MigrationInterface, QueryRunner } from 'typeorm';

export class AwarenessCamp1715768801426 implements MigrationInterface {
  name = 'AwarenessCamp1715768801426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_3b62604b0f7f1c08e1b55697468\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_43b593bbf2cee606ac21e9e6592\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_5ad32ee9565f98cf1359fef29c2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_73662d97455226319a0af7ed20b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_f477b6cbc721e2032c4487fd0e5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP COLUMN \`completedBy\``,
    );
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`createdBy\``);
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP COLUMN \`fhu_bin_id\``,
    );
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`priority\``);
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`user\``);
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP COLUMN \`vending_machine_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`product_id\` int NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`city\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`created_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`completed_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP COLUMN \`ticket_status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD \`ticket_status\` varchar(50) NOT NULL`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE \`ticket\` CHANGE \`completed_at\` \`completed_at\` timestamp NOT NULL`,
    // );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_4981ea501c20a5a42c360b8fc90\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_9d8c1928b5de467553559715614\` FOREIGN KEY (\`city\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_3020be017b973a0a11e638d4cd2\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_cd7bc76a6865e34319b500d4283\` FOREIGN KEY (\`completed_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
