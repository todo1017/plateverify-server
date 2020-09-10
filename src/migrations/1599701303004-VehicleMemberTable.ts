import {MigrationInterface, QueryRunner} from "typeorm";

export class VehicleMemberTable1599701303004 implements MigrationInterface {
    name = 'VehicleMemberTable1599701303004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plate" character varying NOT NULL, "make" character varying NOT NULL, "model" character varying NOT NULL, "body" character varying NOT NULL, "color" character varying NOT NULL, "insurance" character varying NOT NULL, "registration" character varying NOT NULL, "status" character varying NOT NULL DEFAULT false, "roles" jsonb NOT NULL DEFAULT '["partner"]', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "schoolId" uuid, "memberId" uuid, CONSTRAINT "UQ_91f913ee41cc1cd4449b645b52a" UNIQUE ("plate", "schoolId"), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "address" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "grade" character varying NOT NULL, "graduation" character varying NOT NULL, "driver_license" character varying NOT NULL, "tag" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "schoolId" uuid, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_0425f2c37d1bc5193e9259f7544" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_473b4a501d49aac6e1c32487134" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_4d00e845566aad906257e0d9056" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_4d00e845566aad906257e0d9056"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_473b4a501d49aac6e1c32487134"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_0425f2c37d1bc5193e9259f7544"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
    }

}
