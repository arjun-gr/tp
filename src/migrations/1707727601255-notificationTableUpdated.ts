import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationTableUpdated1707727601255
  implements MigrationInterface
{
  name = 'NotificationTableUpdated1707727601255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_692a909ee0fa9383e7859f9b406\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`userId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`toUserId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`fromUserId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`clientId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`notification\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`notification\` longtext NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_f1781c52eb2836d840f1c613f09\` FOREIGN KEY (\`toUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_3a26cceed2f10be1c5e15f7ef6a\` FOREIGN KEY (\`fromUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_b760535ce3bbf06a8dc446c908f\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_b760535ce3bbf06a8dc446c908f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_3a26cceed2f10be1c5e15f7ef6a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_f1781c52eb2836d840f1c613f09\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`notification\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`notification\` varchar(50) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_520_ci" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`clientId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`fromUserId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`toUserId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD \`userId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_692a909ee0fa9383e7859f9b406\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
