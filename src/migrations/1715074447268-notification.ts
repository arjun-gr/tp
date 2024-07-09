import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notification1715074447268 implements MigrationInterface {
  name = 'Notification1715074447268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_3a26cceed2f10be1c5e15f7ef6a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_b760535ce3bbf06a8dc446c908f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_f1781c52eb2836d840f1c613f09\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`is_view\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`toUserId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`fromUserId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP COLUMN \`clientId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` CHANGE \`is_read\` \`is_read\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
