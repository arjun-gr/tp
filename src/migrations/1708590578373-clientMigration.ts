import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientMigration1708590578373 implements MigrationInterface {
  name = 'ClientMigration1708590578373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`female-hygiene-unit\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`product_type\` varchar(50) NOT NULL, \`quantity\` varchar(50) NOT NULL, \`service_type\` varchar(50) NULL, \`service_cost\` varchar(50) NOT NULL COMMENT 'Service cost without gst', \`branchId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`vending-machine\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`product_type\` varchar(50) NOT NULL, \`quantity\` varchar(50) NULL, \`service_type\` varchar(50) NOT NULL, \`rental_amount\` varchar(50) NULL, \`buyout_amount\` varchar(50) NULL, \`refilling_quantity\` varchar(50) NULL, \`refilling_amount\` varchar(50) NULL, \`branchId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`deleted_at\` \`deleted_at\` timestamp(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`gst_number\` \`gst_number\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`so_number\` \`so_number\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`po_number\` \`po_number\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`payment_terms\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`payment_terms\` varchar(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`billing_faq\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`billing_faq\` varchar(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`female_count\` \`female_count\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`city_id\` \`city_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`client_id\` \`client_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`purchase_order\` \`purchase_order\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`sales_order\` \`sales_order\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`agreementId\` \`agreementId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`work_authorization_letter\` \`work_authorization_letter\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`userId\` \`userId\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`female-hygiene-unit\` ADD CONSTRAINT \`FK_04854855b35703f17c8e860acbb\` FOREIGN KEY (\`branchId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`vending-machine\` ADD CONSTRAINT \`FK_80f3168b9da9a4aeebfa7746eff\` FOREIGN KEY (\`branchId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
