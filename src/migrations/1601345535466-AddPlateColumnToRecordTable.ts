import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPlateColumnToRecordTable1601345535466 implements MigrationInterface {
    name = 'AddPlateColumnToRecordTable1601345535466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" ADD "plate" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "plate"`);
    }

}
