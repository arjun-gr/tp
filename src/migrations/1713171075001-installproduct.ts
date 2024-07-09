import { MigrationInterface, QueryRunner } from 'typeorm';

export class Installproduct1713171075001 implements MigrationInterface {
  name = 'Installproduct1713171075001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clients\` MODIFY COLUMN \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` MODIFY COLUMN \`name\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`spocs\` MODIFY COLUMN  \`email\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`spocs\` MODIFY COLUMN  \`phoneNumber\` varchar(13) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
