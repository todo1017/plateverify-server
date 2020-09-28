import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOffenderIdColumnToRecordTable1601308140844 implements MigrationInterface {
    name = 'AddOffenderIdColumnToRecordTable1601308140844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" ADD "offenderId" uuid`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_25e6272adaf9e75a27a4c534470" FOREIGN KEY ("offenderId") REFERENCES "offender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_25e6272adaf9e75a27a4c534470"`);
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "offenderId"`);
    }

}
