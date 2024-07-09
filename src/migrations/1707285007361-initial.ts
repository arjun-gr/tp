import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1707285007361 implements MigrationInterface {
  name = 'Initial1707285007361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`country\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(50) NOT NULL, \`machine_name\` varchar(255) NULL, UNIQUE INDEX \`IDX_f2c1d4b931281988799515342d\` (\`machine_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`states\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(50) NOT NULL, \`machine_name\` varchar(255) NULL, \`countryId\` int NULL, UNIQUE INDEX \`IDX_ddbfb2e61c08c19326a13a6307\` (\`machine_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(100) NOT NULL, \`tier\` enum ('T1', 'T2', 'T3') NOT NULL, \`franchise\` enum ('COCO', 'COFO') NOT NULL, \`no_of_clients\` int NOT NULL DEFAULT '0', \`machine_name\` varchar(255) NULL, \`stateId\` int NULL, UNIQUE INDEX \`IDX_9d4e2adba273742b815f002c69\` (\`machine_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ticket\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`number\` int NOT NULL, \`date\` date NOT NULL, \`type\` enum ('Question', 'Incident', 'Billing', 'Problem', 'Service', 'Other') NOT NULL, \`product\` enum ('Sensor VM', 'Coin + UPI VM', 'Coin + UPI + SIM VM', 'Sleeker Sensor VM', 'Sleeker Coin + UPI VM', 'Sleeker Coin + UPI + SIM VM') NOT NULL, \`bin\` enum ('Pedal Bin', 'Sensor Bin', 'Laal Dabba', 'Small bin') NOT NULL, \`priority\` enum ('Urgent', 'Not Urgent') NOT NULL, \`ticket_status\` enum ('On going', 'Completed', 'Cancelled') NOT NULL, \`subject\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`client\` int NULL, \`branch\` int NULL, \`user\` int NULL, \`createdBy\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`original_name\` varchar(255) NOT NULL COMMENT 'Original file name from the client', \`name\` varchar(255) NOT NULL COMMENT 'System generated filename', \`size\` int NOT NULL, \`disk\` enum ('local', 's3') NOT NULL COMMENT 'The disk used for uploading the file' DEFAULT 'local', \`url\` varchar(1000) NOT NULL COMMENT 'The url of the file', \`mime_type\` varchar(255) NOT NULL, \`ticket\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`clients\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(50) NOT NULL, \`type\` enum ('Corporate', 'Housing', 'Community') NOT NULL, \`entry_type\` enum ('Installation', 'Demo') NOT NULL, \`creation_type\` enum ('New-client', 'Site-addition', 'Existing-client', 'Renewal-client') NOT NULL, \`machine_name\` varchar(255) NULL, \`logoId\` int NULL, UNIQUE INDEX \`IDX_2ce83586747422df70748a7274\` (\`machine_name\`), UNIQUE INDEX \`REL_1ec04ce2c40f6f68b57386a03e\` (\`logoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`spocs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(50) NOT NULL, \`email\` varchar(50) NOT NULL, \`phoneNumber\` varchar(50) NOT NULL, \`machine_name\` varchar(255) NULL, \`branchId\` int NULL, UNIQUE INDEX \`IDX_161c679f55f67519da4c293080\` (\`machine_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`branch\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(50) NOT NULL, \`billing_address\` varchar(50) NOT NULL, \`site_address\` varchar(50) NOT NULL, \`gst_number\` int NULL, \`so_number\` int NULL, \`payment_terms\` enum ('Due on receipt', '15 Days', '30 Days', '45 Days', '60 Days') NOT NULL, \`billing_faq\` enum ('Fortnightly', 'Monthly', 'Quarterly', 'Half_quarterly', 'Yearly', 'One_time') NOT NULL, \`so_received_date\` date NOT NULL, \`contract_start_date\` date NOT NULL, \`contract_end_date\` date NOT NULL, \`female_count\` int NULL, \`fhu_product_type\` enum ('Pedal Bin', 'Sensor Bin', 'Laal Dabba', 'Small bin') NOT NULL, \`fhu_quantity\` int NOT NULL, \`fhu_service_type\` enum ('Pedal Bin', 'Sensor Bin', 'Laal Dabba', 'Small bin') NOT NULL, \`fhu_service_cost\` int NOT NULL COMMENT 'Service cost without gst', \`vm_product_type\` enum ('Sensor VM', 'Coin + UPI VM', 'Coin + UPI + SIM VM', 'Sleeker Sensor VM', 'Sleeker Coin + UPI VM', 'Sleeker Coin + UPI + SIM VM') NOT NULL, \`vm_quantity\` int NOT NULL, \`vm_service_type\` enum ('Buyout', 'Rental') NOT NULL, \`vm_rental_amount\` int NULL, \`vm_buyout_amount\` int NULL, \`vm_refilling_quantity\` int NULL, \`vm_refilling_amount\` int NULL, \`sales_lead\` varchar(150) NOT NULL, \`city_id\` int NULL, \`client_id\` int NULL, \`purchase_order\` int NULL, \`sales_order\` int NULL, \`agreementId\` int NULL, \`work_authorization_letter\` int NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_ea505de524948f7df2a15127f3\` (\`purchase_order\`), UNIQUE INDEX \`REL_abaddb5b2b40db1fb7b4980aae\` (\`sales_order\`), UNIQUE INDEX \`REL_16b8cb8ceabefc197a821f15ae\` (\`agreementId\`), UNIQUE INDEX \`REL_ad63be993ace1933c104142769\` (\`work_authorization_letter\`), UNIQUE INDEX \`REL_f969fd357b4491268a4520e8a0\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`employee-profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`type\` enum ('City_Ops_Manager', 'City_Executive') NOT NULL, \`profile_pic_id\` int NOT NULL DEFAULT '0', \`phone_number\` varchar(50) NOT NULL, \`designation\` varchar(50) NOT NULL, \`division\` enum ('Manager', 'Service') NOT NULL, \`jobType\` enum ('Employee', 'Intern') NOT NULL, \`user_id\` int NULL, UNIQUE INDEX \`REL_9d089ac707df7de0afbe7a10ca\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(50) NOT NULL, \`machine_name\` varchar(255) NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), UNIQUE INDEX \`IDX_be6ed9201fbd16ddcc8dfd8bab\` (\`machine_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NULL, \`user_name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`user_type\` enum ('Super-Admin', 'Client', 'Employee') NULL, \`client_id\` int NULL, \`branch_id\` int NULL, \`employee_id\` int NULL, UNIQUE INDEX \`REL_5a58f726a41264c8b3e86d4a1d\` (\`branch_id\`), UNIQUE INDEX \`REL_9760615d88ed518196bb79ea03\` (\`employee_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`awareness_camp\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`emp_type\` enum ('female_employees', 'housekeeping_staff', 'Both') NOT NULL, \`email\` varchar(100) NULL, \`phone_number\` varchar(50) NOT NULL, \`no_of_employee\` int NOT NULL DEFAULT '0', \`event_date\` timestamp NULL, \`status\` enum ('On going', 'Planned', 'Completed', 'Reject') NOT NULL, \`clientStatus\` enum ('Open', 'Closed', 'Resolved') NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`authorized-token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`refreshTokenHash\` varchar(255) NOT NULL, \`accessTokenHash\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, UNIQUE INDEX \`REL_d36f81e88697b0d6611a9a122c\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`email-log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`status\` tinyint NOT NULL, \`sender\` text NOT NULL, \`receiver\` text NOT NULL, \`errorLog\` text NULL, \`message\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`notification\` varchar(50) NOT NULL, \`is_read\` tinyint NOT NULL, \`is_view\` tinyint NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_assignees\` (\`city_manager_id\` int NOT NULL, \`executive_id\` int NOT NULL, PRIMARY KEY (\`city_manager_id\`, \`executive_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_city\` (\`user_id\` int NOT NULL, \`city_id\` int NOT NULL, INDEX \`IDX_c7b888785deb02d41a83524d7f\` (\`user_id\`), INDEX \`IDX_27f09d864ae608c48ea27dc886\` (\`city_id\`), PRIMARY KEY (\`user_id\`, \`city_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_roles\` (\`user_id\` int NOT NULL, \`role_id\` int NOT NULL, INDEX \`IDX_87b8888186ca9769c960e92687\` (\`user_id\`), INDEX \`IDX_b23c65e50a758245a33ee35fda\` (\`role_id\`), PRIMARY KEY (\`user_id\`, \`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`CREATE TABLE \`female-hygiene-unit\` (
            \`id\` int(11) NOT NULL,
            \`is_active\` tinyint(4) NOT NULL DEFAULT '1',
            \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            \`deleted_at\` timestamp(6) NULL DEFAULT NULL,
            \`product_type\` enum('Pedal Bin','Sensor Bin','Laal Dabba','Small bin') COLLATE utf8mb4_unicode_520_ci NOT NULL,
            \`service_type\` enum('Weekly','10 Days','Fortnightly','Monthly') COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            \`branchId\` int(11) DEFAULT NULL,
            \`quantity\` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            \`service_cost\` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'Service cost without gst',
            PRIMARY KEY (\`id\`),
            KEY \`FK_04854855b35703f17c8e860acbb\` (\`branchId\`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
          `);
    await queryRunner.query(`CREATE TABLE \`vending-machine\` (
            \`id\` int(11) NOT NULL,
            \`is_active\` tinyint(4) NOT NULL DEFAULT '1',
            \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            \`deleted_at\` timestamp(6) NULL DEFAULT NULL,
            \`product_type\` enum('Sensor VM','Coin + UPI VM','Coin + UPI + SIM VM','Sleeker Sensor VM','Sleeker Coin + UPI VM','Sleeker Coin + UPI + SIM VM') COLLATE utf8mb4_unicode_520_ci NOT NULL,
            \`service_type\` enum('Buyout','Rental') COLLATE utf8mb4_unicode_520_ci NOT NULL,
            \`branchId\` int(11) DEFAULT NULL,
            \`quantity\` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
            \`rental_amount\` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            \`buyout_amount\` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            \`refilling_quantity\` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
            \`refilling_amount\` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
          `);
    await queryRunner.query(
      `CREATE INDEX \`IDX_a76a7d7baf422432b58821e90b\` ON \`user_assignees\` (\`city_manager_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_126a90534b8a769bc708943e58\` ON \`user_assignees\` (\`executive_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`states\` ADD CONSTRAINT \`FK_76ac7edf8f44e80dff569db7321\` FOREIGN KEY (\`countryId\`) REFERENCES \`country\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cities\` ADD CONSTRAINT \`FK_ded8a17cd090922d5bac8a2361f\` FOREIGN KEY (\`stateId\`) REFERENCES \`states\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_054a517f7e061cc2819d4e821a9\` FOREIGN KEY (\`client\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_0f0cea3ccb8353cd5426b2ef78c\` FOREIGN KEY (\`branch\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_73662d97455226319a0af7ed20b\` FOREIGN KEY (\`user\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_5ad32ee9565f98cf1359fef29c2\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD CONSTRAINT \`FK_b73223f53f0f9879246b5d7bfe6\` FOREIGN KEY (\`ticket\`) REFERENCES \`ticket\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD CONSTRAINT \`FK_1ec04ce2c40f6f68b57386a03e3\` FOREIGN KEY (\`logoId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`spocs\` ADD CONSTRAINT \`FK_7ab86177e66a8a50cd7302cb889\` FOREIGN KEY (\`branchId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_f5ef543824472fcefeaf99d4f67\` FOREIGN KEY (\`city_id\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_e641584bd1cf87bf8f0b778b061\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_ea505de524948f7df2a15127f35\` FOREIGN KEY (\`purchase_order\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_abaddb5b2b40db1fb7b4980aaec\` FOREIGN KEY (\`sales_order\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_16b8cb8ceabefc197a821f15ae8\` FOREIGN KEY (\`agreementId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_ad63be993ace1933c1041427699\` FOREIGN KEY (\`work_authorization_letter\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_f969fd357b4491268a4520e8a07\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` ADD CONSTRAINT \`FK_9d089ac707df7de0afbe7a10ca3\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_0d1e90d75674c54f8660c4ed446\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_5a58f726a41264c8b3e86d4a1de\` FOREIGN KEY (\`branch_id\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_9760615d88ed518196bb79ea03d\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employee-profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` ADD CONSTRAINT \`FK_c6ede476bbef74d99c3e3c84c12\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`authorized-token\` ADD CONSTRAINT \`FK_d36f81e88697b0d6611a9a122c5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_692a909ee0fa9383e7859f9b406\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_assignees\` ADD CONSTRAINT \`FK_a76a7d7baf422432b58821e90b8\` FOREIGN KEY (\`city_manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_assignees\` ADD CONSTRAINT \`FK_126a90534b8a769bc708943e589\` FOREIGN KEY (\`executive_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_city\` ADD CONSTRAINT \`FK_c7b888785deb02d41a83524d7f0\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_city\` ADD CONSTRAINT \`FK_27f09d864ae608c48ea27dc886c\` FOREIGN KEY (\`city_id\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_87b8888186ca9769c960e926870\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_b23c65e50a758245a33ee35fda1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_b23c65e50a758245a33ee35fda1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_87b8888186ca9769c960e926870\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_city\` DROP FOREIGN KEY \`FK_27f09d864ae608c48ea27dc886c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_city\` DROP FOREIGN KEY \`FK_c7b888785deb02d41a83524d7f0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_assignees\` DROP FOREIGN KEY \`FK_126a90534b8a769bc708943e589\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_assignees\` DROP FOREIGN KEY \`FK_a76a7d7baf422432b58821e90b8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_692a909ee0fa9383e7859f9b406\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`authorized-token\` DROP FOREIGN KEY \`FK_d36f81e88697b0d6611a9a122c5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`awareness_camp\` DROP FOREIGN KEY \`FK_c6ede476bbef74d99c3e3c84c12\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_9760615d88ed518196bb79ea03d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_5a58f726a41264c8b3e86d4a1de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_0d1e90d75674c54f8660c4ed446\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee-profile\` DROP FOREIGN KEY \`FK_9d089ac707df7de0afbe7a10ca3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_f969fd357b4491268a4520e8a07\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_ad63be993ace1933c1041427699\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_16b8cb8ceabefc197a821f15ae8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_abaddb5b2b40db1fb7b4980aaec\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_ea505de524948f7df2a15127f35\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_e641584bd1cf87bf8f0b778b061\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_f5ef543824472fcefeaf99d4f67\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`spocs\` DROP FOREIGN KEY \`FK_7ab86177e66a8a50cd7302cb889\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` DROP FOREIGN KEY \`FK_1ec04ce2c40f6f68b57386a03e3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_b73223f53f0f9879246b5d7bfe6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_5ad32ee9565f98cf1359fef29c2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_73662d97455226319a0af7ed20b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_0f0cea3ccb8353cd5426b2ef78c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_054a517f7e061cc2819d4e821a9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cities\` DROP FOREIGN KEY \`FK_ded8a17cd090922d5bac8a2361f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`states\` DROP FOREIGN KEY \`FK_76ac7edf8f44e80dff569db7321\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_126a90534b8a769bc708943e58\` ON \`user_assignees\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a76a7d7baf422432b58821e90b\` ON \`user_assignees\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b23c65e50a758245a33ee35fda\` ON \`user_roles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_87b8888186ca9769c960e92687\` ON \`user_roles\``,
    );
    await queryRunner.query(`DROP TABLE \`user_roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_27f09d864ae608c48ea27dc886\` ON \`user_city\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c7b888785deb02d41a83524d7f\` ON \`user_city\``,
    );
    await queryRunner.query(`DROP TABLE \`user_city\``);
    await queryRunner.query(`DROP TABLE \`user_assignees\``);
    await queryRunner.query(`DROP TABLE \`notifications\``);
    await queryRunner.query(`DROP TABLE \`email-log\``);
    await queryRunner.query(
      `DROP INDEX \`REL_d36f81e88697b0d6611a9a122c\` ON \`authorized-token\``,
    );
    await queryRunner.query(`DROP TABLE \`authorized-token\``);
    await queryRunner.query(`DROP TABLE \`awareness_camp\``);
    await queryRunner.query(
      `DROP INDEX \`REL_9760615d88ed518196bb79ea03\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_5a58f726a41264c8b3e86d4a1d\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_be6ed9201fbd16ddcc8dfd8bab\` ON \`roles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`REL_9d089ac707df7de0afbe7a10ca\` ON \`employee-profile\``,
    );
    await queryRunner.query(`DROP TABLE \`employee-profile\``);
    await queryRunner.query(
      `DROP INDEX \`REL_f969fd357b4491268a4520e8a0\` ON \`branch\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_ad63be993ace1933c104142769\` ON \`branch\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_16b8cb8ceabefc197a821f15ae\` ON \`branch\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_abaddb5b2b40db1fb7b4980aae\` ON \`branch\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_ea505de524948f7df2a15127f3\` ON \`branch\``,
    );
    await queryRunner.query(`DROP TABLE \`branch\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_161c679f55f67519da4c293080\` ON \`spocs\``,
    );
    await queryRunner.query(`DROP TABLE \`spocs\``);
    await queryRunner.query(
      `DROP INDEX \`REL_1ec04ce2c40f6f68b57386a03e\` ON \`clients\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2ce83586747422df70748a7274\` ON \`clients\``,
    );
    await queryRunner.query(`DROP TABLE \`clients\``);
    await queryRunner.query(`DROP TABLE \`file\``);
    await queryRunner.query(`DROP TABLE \`ticket\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_9d4e2adba273742b815f002c69\` ON \`cities\``,
    );
    await queryRunner.query(`DROP TABLE \`cities\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ddbfb2e61c08c19326a13a6307\` ON \`states\``,
    );
    await queryRunner.query(`DROP TABLE \`states\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f2c1d4b931281988799515342d\` ON \`country\``,
    );
    await queryRunner.query(`DROP TABLE \`country\``);
  }
}
