import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGrouptoMemberTable1599702445941 implements MigrationInterface {
    name = 'AddGrouptoMemberTable1599702445941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ADD "group" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "group"`);
    }

}
