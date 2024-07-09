import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntities1709537845035 implements MigrationInterface {
  name = 'UpdateEntities1709537845035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog\` CHANGE \`is_feature_post\` \`is_feature\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaterals\` CHANGE \`is_feature_post\` \`is_feature\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video\` CHANGE \`is_feature_post\` \`is_feature\` tinyint NOT NULL DEFAULT '0'`,
    );

    await queryRunner.query(`DROP TABLE \`feature_post\` `);

    await queryRunner.query(
      `CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`thumbnailId\` int NULL, UNIQUE INDEX \`REL_f18e1cb07c5084fe164fe06e1a\` (\`thumbnailId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`spocs\` DROP COLUMN \`machine_name\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`female-hygiene-unit\` CHANGE \`product_type\` \`product_type\` varchar(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`female-hygiene-unit\` DROP COLUMN \`quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`female-hygiene-unit\` ADD \`quantity\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`female-hygiene-unit\` DROP COLUMN \`service_cost\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`female-hygiene-unit\` ADD \`service_cost\` decimal(10,2) NOT NULL COMMENT 'Service cost without gst'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`spocs\` DROP COLUMN \`phoneNumber\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`spocs\` ADD \`phoneNumber\` varchar(13) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` DROP COLUMN \`quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` ADD \`quantity\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` CHANGE \`service_type\` \`service_type\` varchar(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` DROP COLUMN \`rental_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` ADD \`rental_amount\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` DROP COLUMN \`buyout_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` ADD \`buyout_amount\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` DROP COLUMN \`refilling_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` ADD \`refilling_quantity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` DROP COLUMN \`refilling_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` ADD \`refilling_amount\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`status\` enum ('Planned', 'Completed', 'Cancelled', 'Ongoing') NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`agents\` DROP COLUMN \`quantity\``);
    await queryRunner.query(
      `ALTER TABLE \`agents\` ADD \`quantity\` int NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_f18e1cb07c5084fe164fe06e1a3\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
