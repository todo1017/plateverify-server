import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSettingTable1600872747833 implements MigrationInterface {
    name = 'CreateSettingTable1600872747833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "body" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "schoolId" uuid, CONSTRAINT "UQ_dbe72510b1c5abb4c22617cca70" UNIQUE ("schoolId", "category"), CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_5de5fd20f053b704fccff0d430c" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_5de5fd20f053b704fccff0d430c"`);
        await queryRunner.query(`DROP TABLE "setting"`);
    }

}
