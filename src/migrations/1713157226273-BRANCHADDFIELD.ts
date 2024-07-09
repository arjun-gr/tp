import { MigrationInterface, QueryRunner } from 'typeorm';

export class BRANCHADDFIELD1713157226273 implements MigrationInterface {
  name = 'BRANCHADDFIELD1713157226273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`branch\` ADD \`pincode\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
