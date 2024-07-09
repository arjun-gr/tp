import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchtableUpdate1708064747685 implements MigrationInterface {
  name = 'BranchtableUpdate1708064747685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`gst_number\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`gst_number\` varchar(50) NULL`,
    );

    await queryRunner.query(`ALTER TABLE \`branch\` DROP COLUMN \`so_number\``);
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`so_number\` varchar(50) NULL`,
    );

    await queryRunner.query(`ALTER TABLE \`branch\` DROP COLUMN \`po_number\``);
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`po_number\` varchar(50) NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`fhu_service_cost\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`fhu_service_cost\` decimal(10,2) NOT NULL DEFAULT '0.00'`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`female_count\` \`female_count\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_rental_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`vm_rental_amount\` decimal(10,2) NOT NULL DEFAULT '0.00'`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_buyout_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`vm_buyout_amount\` decimal(10,2) NOT NULL DEFAULT '0.00'`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` CHANGE \`vm_refilling_quantity\` \`vm_refilling_quantity\` int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`branch\` DROP COLUMN \`vm_refilling_amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branch\` ADD \`vm_refilling_amount\` decimal(10,2) NOT NULL DEFAULT '0.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
