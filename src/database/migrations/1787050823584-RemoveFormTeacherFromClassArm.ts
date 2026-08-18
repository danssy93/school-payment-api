import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFormTeacherFromClassArm1787050823584 implements MigrationInterface {
    name = 'RemoveFormTeacherFromClassArm1787050823584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_arms" DROP COLUMN "bursar_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_arms" ADD "bursar_id" uuid`);
    }

}
