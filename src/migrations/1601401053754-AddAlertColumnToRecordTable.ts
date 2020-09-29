import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAlertColumnToRecordTable1601401053754 implements MigrationInterface {
    name = 'AddAlertColumnToRecordTable1601401053754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" ADD "alert" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "alert"`);
    }

}
