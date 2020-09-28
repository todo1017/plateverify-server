import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFlagColumnsFromVehicleTable1601304845945 implements MigrationInterface {
    name = 'AddFlagColumnsFromVehicleTable1601304845945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "flagged" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "flags" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "flags"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "flagged"`);
    }

}
