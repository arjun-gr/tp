import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntities21709553546167 implements MigrationInterface {
  name = 'UpdateEntities21709553546167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` CHANGE \`emp_type\` \`emp_type\` varchar(255) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` CHANGE \`email\` \`email\` varchar(50) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` CHANGE \`phone_number\` \`phone_number\` varchar(13) NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`user_type\` \`user_type\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
