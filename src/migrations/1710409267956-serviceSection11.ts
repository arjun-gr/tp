import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceSection111710409267956 implements MigrationInterface {
  name = 'ServiceSection111710409267956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`padcare_files\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`entityId\` int NOT NULL, \`entityType\` varchar(50) NOT NULL, \`fileId\` int NOT NULL, \`fileType\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
