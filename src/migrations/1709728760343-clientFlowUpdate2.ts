import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientFlowUpdate21709728760343 implements MigrationInterface {
  name = 'ClientFlowUpdate21709728760343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD \`productId\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD CONSTRAINT \`FK_2f2b9156f6d41af5cc4509eaefb\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
