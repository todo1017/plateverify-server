import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRelationColumnsFromVehicleTable1601004853301 implements MigrationInterface {
    name = 'UpdateRelationColumnsFromVehicleTable1601004853301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_473b4a501d49aac6e1c32487134"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "memberId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_473b4a501d49aac6e1c32487134" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_473b4a501d49aac6e1c32487134"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "memberId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_473b4a501d49aac6e1c32487134" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
