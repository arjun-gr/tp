import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceEnitityCreation1708427330529 implements MigrationInterface {
  name = 'ServiceEnitityCreation1708427330529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`services\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`type\` varchar(50) NOT NULL, \`date\` date NOT NULL, \`rating\` int NULL, \`status\` varchar(50) NOT NULL, \`user_id\` int NULL, \`client_id\` int NULL, \`city_id\` int NULL, \`branch_id\` int NULL,\`reason\` varchar(255) NULL,\`rescheduleDate\` date NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_421b94f0ef1cdb407654e67c59e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_458874e221f4ed82fa478b755d8\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_2c8f4f739d48ea0448550d36840\` FOREIGN KEY (\`city_id\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_4f1742f6a88559bd0fab6851170\` FOREIGN KEY (\`branch_id\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE TABLE \`agents\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(50) NOT NULL, \`quantity\` varchar(50) NOT NULL,\`serviceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    // await queryRunner.query(`ALTER TABLE \`agents\` ADD \`serviceId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`agents\` ADD CONSTRAINT \`FK_1bbe155ba7997d5d95ebd311270\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
