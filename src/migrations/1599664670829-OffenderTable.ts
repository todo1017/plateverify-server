import {MigrationInterface, QueryRunner} from "typeorm";

export class OffenderTable1599664670829 implements MigrationInterface {
    name = 'OffenderTable1599664670829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "offender" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "risk_level" character varying NOT NULL, "plate" character varying NOT NULL, "vehicle_make" character varying NOT NULL, "vehicle_model" character varying NOT NULL, "vehicle_color" character varying NOT NULL, "vehicle_year" character varying NOT NULL, "vehicle_state" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "UQ_406d34494e1ad4354694af318c8" UNIQUE ("plate"), CONSTRAINT "PK_1feac0d905ee30bec1e5c3c9c9d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "offender"`);
    }

}
