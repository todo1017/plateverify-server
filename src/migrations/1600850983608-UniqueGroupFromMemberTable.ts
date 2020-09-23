import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqueGroupFromMemberTable1600850983608 implements MigrationInterface {
    name = 'UniqueGroupFromMemberTable1600850983608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "UQ_a12023edcce77e20be204934edb" UNIQUE ("first_name", "last_name", "group", "email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "UQ_a12023edcce77e20be204934edb"`);
    }

}
