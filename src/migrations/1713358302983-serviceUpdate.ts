import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceUpdate1713358302983 implements MigrationInterface {
  name = 'ServiceUpdate1713358302983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_69dc34ad5b46a9e92d10281a7af\``,
    );

    await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`reason\``);
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`fhu_bin_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`fhu_invoice_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`vm_service_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`vm_service_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`5_rs_pad_ref_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`10_rs_pad_ref_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`5_rs_coin_coll_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`10_rs_coin_coll_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`5_rs_pad_sold_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`10_rs_pad_sold_quantity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`pad_sold_invoice_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP COLUMN \`completedBy\``,
    );
    // await queryRunner.query(`ALTER TABLE \`installed_product\` DROP COLUMN \`serviceId\``);

    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`serviced_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`vehicle_used\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`bin_maintenace_part\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`bin_part_qty\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`is_invoice_submitted\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`invoice_other_detail\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`reschedule_reason\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`reschedule_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`reschedule_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`cancelled_date\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`cancelled_reason\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`cancelled_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`cancelled_by\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD \`completed_by\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_4e8965f2b6408988dece9f6246c\` FOREIGN KEY (\`reschedule_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_84b1f112d5f97a2ef25b7423f5b\` FOREIGN KEY (\`cancelled_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_ef9557d69b0c2b82478f2e4084f\` FOREIGN KEY (\`completed_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
