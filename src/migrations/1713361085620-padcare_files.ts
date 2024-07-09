import { MigrationInterface, QueryRunner } from 'typeorm';

export class PadcareFiles1713361085620 implements MigrationInterface {
  name = 'PadcareFiles1713361085620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD \`client_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD \`city_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD \`branch_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD \`purchase_id\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_4f52aa671ab2f38bf1354d5143e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_44a58b26ab82dfe632011a16fe2\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_b78e68637b303883d3045b8638e\` FOREIGN KEY (\`city_id\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_c2cd5d292fc8fef63df66d58703\` FOREIGN KEY (\`branch_id\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`padcare_files\` ADD CONSTRAINT \`FK_d5ccdc0cf6b0b06a3f3e0c26b2f\` FOREIGN KEY (\`purchase_id\`) REFERENCES \`purchase\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
