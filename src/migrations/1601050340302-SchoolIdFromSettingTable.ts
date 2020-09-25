import {MigrationInterface, QueryRunner} from "typeorm";

export class SchoolIdFromSettingTable1601050340302 implements MigrationInterface {
    name = 'SchoolIdFromSettingTable1601050340302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_5de5fd20f053b704fccff0d430c"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "UQ_dbe72510b1c5abb4c22617cca70"`);
        await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "schoolId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "UQ_dbe72510b1c5abb4c22617cca70" UNIQUE ("schoolId", "category")`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_5de5fd20f053b704fccff0d430c" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_5de5fd20f053b704fccff0d430c"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "UQ_dbe72510b1c5abb4c22617cca70"`);
        await queryRunner.query(`ALTER TABLE "setting" ALTER COLUMN "schoolId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "UQ_dbe72510b1c5abb4c22617cca70" UNIQUE ("category", "schoolId")`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_5de5fd20f053b704fccff0d430c" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
