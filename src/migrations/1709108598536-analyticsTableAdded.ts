import { MigrationInterface, QueryRunner } from 'typeorm';

export class AnalyticsTableAdded1709108598536 implements MigrationInterface {
  name = 'AnalyticsTableAdded1709108598536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`analytics\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`date\` date NOT NULL, \`pads_collected\` int NOT NULL, \`material_processed_kg\` int NOT NULL, \`landfill_area_saved_liters\` int NOT NULL, \`carbon_equivalents_conserved_kg\` int NOT NULL, \`client\` int NULL, \`branch\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD CONSTRAINT \`FK_0a2417c4226f786b4bb7d0b38ee\` FOREIGN KEY (\`client\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` ADD CONSTRAINT \`FK_9111ea543af28f3c39f4130bbf6\` FOREIGN KEY (\`branch\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`analytics\` DROP FOREIGN KEY \`FK_9111ea543af28f3c39f4130bbf6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`analytics\` DROP FOREIGN KEY \`FK_0a2417c4226f786b4bb7d0b38ee\``,
    );

    await queryRunner.query(`DROP TABLE \`analytics\``);
  }
}
