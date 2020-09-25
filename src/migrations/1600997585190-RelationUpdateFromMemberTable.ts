import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationUpdateFromMemberTable1600997585190 implements MigrationInterface {
    name = 'RelationUpdateFromMemberTable1600997585190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "UQ_a12023edcce77e20be204934edb"`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "UQ_d28ae7ca352de0c354388ff6fb4" UNIQUE ("first_name", "last_name", "group", "email", "schoolId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "UQ_d28ae7ca352de0c354388ff6fb4"`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "UQ_a12023edcce77e20be204934edb" UNIQUE ("first_name", "last_name", "group", "email")`);
    }

}
