import { MigrationInterface, QueryRunner } from 'typeorm';

export class Employeeform1713266406330 implements MigrationInterface {
  name = 'Employeeform1713266406330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` CHANGE \`designation\` \`designation\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
