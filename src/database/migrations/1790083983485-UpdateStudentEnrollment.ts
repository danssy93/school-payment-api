import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentEnrollment1790083983485 implements MigrationInterface {
    name = 'UpdateStudentEnrollment1790083983485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_87760284df287541de210ed147"`);
        await queryRunner.query(`ALTER TABLE "students" ADD "status_reason" text`);
        await queryRunner.query(`CREATE TYPE "public"."class_arms_type_enum" AS ENUM('new_admission', 'regular')`);
        await queryRunner.query(`ALTER TABLE "class_arms" ADD "type" "public"."class_arms_type_enum" NOT NULL DEFAULT 'regular'`);
        await queryRunner.query(`ALTER TABLE "guardians" ALTER COLUMN "work_address" DROP NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_student_active_enrollment_session" ON "student_enrollment"  ("student_id", "session_id") WHERE "is_active" = true AND "deleted_at" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_student_active_enrollment_session"`);
        await queryRunner.query(`ALTER TABLE "guardians" ALTER COLUMN "work_address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "class_arms" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."class_arms_type_enum"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "status_reason"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_87760284df287541de210ed147" ON "student_enrollment" USING btree ("session_id", "student_id") `);
    }

}
