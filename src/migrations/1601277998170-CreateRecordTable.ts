import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateRecordTable1601277998170 implements MigrationInterface {
    name = 'CreateRecordTable1601277998170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "schoolId" uuid, "memberId" uuid, "vehicleId" uuid, "meta" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_d490919e92f573a3e83617c951e" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_3288821042ed1b7f6b8dc346776" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_be8efc5630be9366650844c8356" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_be8efc5630be9366650844c8356"`);
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_3288821042ed1b7f6b8dc346776"`);
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_d490919e92f573a3e83617c951e"`);
        await queryRunner.query(`DROP TABLE "record"`);
    }

}
