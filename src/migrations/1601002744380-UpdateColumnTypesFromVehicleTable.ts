import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateColumnTypesFromVehicleTable1601002744380 implements MigrationInterface {
    name = 'UpdateColumnTypesFromVehicleTable1601002744380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "insurance" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "registration" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "status" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "status" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "registration" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "insurance" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "roles" jsonb NOT NULL DEFAULT '["partner"]'`);
    }

}
