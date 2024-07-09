import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notification1712832978170 implements MigrationInterface {
  name = 'Notification1712832978170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE \`notifications\` DROP COLUMN \`is_view\``,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`notifications\` DROP FOREIGN KEY IF EXISTS \`FK_3a26cceed2f10be1c5e15f7ef6a\``,
    // );

    // await queryRunner.query(
    //   `ALTER TABLE \`notifications\` DROP FOREIGN KEY IF EXISTS \`FK_f1781c52eb2836d840f1c613f09\``,
    // );

    // await queryRunner.query(
    //   `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_b760535ce3bbf06a8dc446c908f\``,
    // );

    // await queryRunner.query(
    //   `ALTER TABLE 'notifications' DROP COLUMN 'clientId'`,
    // );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`title\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`extra_param\` longtext NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`to_user\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`from_user\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_99e57867bfa5e603ec109264623\` FOREIGN KEY (\`to_user\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_186e0d51faad7413bca589fd0e8\` FOREIGN KEY (\`from_user\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
