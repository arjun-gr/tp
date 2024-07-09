import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceUpdate1710423302973 implements MigrationInterface {
  name = 'ServiceUpdate1710423302973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`purchase_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_b2abf9ba8d5a0b1fa178055f228\` FOREIGN KEY (\`purchase_id\`) REFERENCES \`purchase\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
