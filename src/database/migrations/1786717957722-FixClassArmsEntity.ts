import { MigrationInterface, QueryRunner } from "typeorm";

export class FixClassArmsEntity1786717957722 implements MigrationInterface {
    name = 'FixClassArmsEntity1786717957722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_arms" ADD "bursar_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_arms" DROP COLUMN "bursar_id"`);
    }

}
