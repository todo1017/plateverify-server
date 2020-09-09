import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationFromUsertoSchoolTable1599623673575 implements MigrationInterface {
    name = 'RelationFromUsertoSchoolTable1599623673575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "schoolId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_709e51110daa2b560f0fc32367b" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_709e51110daa2b560f0fc32367b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "schoolId"`);
    }

}
