import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientFlowUpdate1709703772601 implements MigrationInterface {
  name = 'ClientFlowUpdate1709703772601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE \`employee-profile\` CHANGE \`profilePicId\` \`profile_pic_id\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(50) NOT NULL, \`type\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`purchase\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`type\` varchar(50) NOT NULL, \`status\` varchar(50) NOT NULL, \`so_number\` varchar(50) NULL, \`po_number\` varchar(50) NULL, \`payment_terms\` varchar(50) NOT NULL, \`billing_faq\` varchar(50) NOT NULL, \`so_received_date\` date NOT NULL, \`contract_start_date\` date NOT NULL, \`contract_end_date\` date NOT NULL, \`branchId\` int NULL, \`purchase_order\` int NULL, \`sales_order\` int NULL, \`agreementId\` int NULL, \`work_authorization_letter\` int NULL,\`email_confirmation\` int NULL, UNIQUE INDEX \`REL_b25845ef40a87fe9a8c440208b\` (\`purchase_order\`), UNIQUE INDEX \`REL_96d322b407099698242fdc6fa6\` (\`sales_order\`), UNIQUE INDEX \`REL_5f4e80b354912104d8d33f71ff\` (\`agreementId\`), UNIQUE INDEX \`REL_54bba1e39821c2d83461f2d1bc\` (\`work_authorization_letter\`),UNIQUE INDEX \`FK_6bdd32829e1e6a8ecf42729a9ww\` (\`email_confirmation\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`branch_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`quantity\` int NOT NULL, \`service_type\` varchar(50) NULL, \`service_cost\` decimal(10,2) NULL COMMENT 'Service cost without gst', \`rental_amount\` decimal(10,2) NULL, \`buyout_amount\` decimal(10,2) NULL, \`refilling_quantity\` int NULL, \`refilling_amount\` decimal(10,2) NULL, \`status\` varchar(50) NOT NULL, \`expected_cost\` decimal(10,2) NULL, \`actual_cost\` decimal(10,2) NULL, \`terminate_at\` timestamp NULL, \`terminate_reason\` varchar(255) NULL, \`purchaseId\` int NULL, \`branchId\` int NULL, \`terminated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD CONSTRAINT \`FK_a9e4c0d30acd32d5c032cdeaf78\` FOREIGN KEY (\`purchaseId\`) REFERENCES \`purchase\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD CONSTRAINT \`FK_0cef02e8795db6045935e881455\` FOREIGN KEY (\`branchId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch_product\` ADD CONSTRAINT \`FK_a3ad8ea1c11af3249c298662af3\` FOREIGN KEY (\`terminated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_6bdd32829e1e6a8ecf42729a9ee\` FOREIGN KEY (\`branchId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_b25845ef40a87fe9a8c440208b1\` FOREIGN KEY (\`purchase_order\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_96d322b407099698242fdc6fa69\` FOREIGN KEY (\`sales_order\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_5f4e80b354912104d8d33f71ffe\` FOREIGN KEY (\`agreementId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase\` ADD CONSTRAINT \`FK_54bba1e39821c2d83461f2d1bc5\` FOREIGN KEY (\`work_authorization_letter\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // await queryRunner.query(
    //   `ALTER TABLE \`clients\` DROP IF EXISTS \`entry_type\``,
    // );

    // await queryRunner.query(
    //   `ALTER TABLE \`branch\` DROP IF EXISTS \`so_received_date\``,
    // );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_ea505de524948f7df2a15127f35\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`purchase_order\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_abaddb5b2b40db1fb7b4980aaec\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`sales_order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_16b8cb8ceabefc197a821f15ae8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`agreementId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_ad63be993ace1933c1041427699\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`work_authorization_letter\``,
    );
    await queryRunner.query(`ALTER TABLE \`branch\` DROP COLUMN \`so_number\``);
    await queryRunner.query(`ALTER TABLE \`branch\` DROP COLUMN \`po_number\``);
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`payment_terms\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`billing_faq\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`billing_addr_pincode\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`site_addr_pincode\``,
    );

    await queryRunner.query(`DROP TABLE \`female-hygiene-unit\``);
    await queryRunner.query(`DROP TABLE \`vending-machine\``);
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD COLUMN \`contract_period\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
