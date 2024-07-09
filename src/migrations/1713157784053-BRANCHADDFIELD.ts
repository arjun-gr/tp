import { MigrationInterface, QueryRunner } from 'typeorm';

export class BRANCHADDFIELD1713157784053 implements MigrationInterface {
  name = 'BRANCHADDFIELD1713157784053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clients\` CHANGE \`creation_type\` \`creation_type\` varchar(50) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
