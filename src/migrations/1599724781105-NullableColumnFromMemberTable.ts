import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableColumnFromMemberTable1599724781105 implements MigrationInterface {
    name = 'NullableColumnFromMemberTable1599724781105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "driver_license" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "tag" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "tag" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "driver_license" SET NOT NULL`);
    }

}
