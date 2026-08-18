import { MigrationInterface, QueryRunner } from "typeorm";

export class InitStaffAssignmentModule1787049114217 implements MigrationInterface {
    name = 'InitStaffAssignmentModule1787049114217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."staff_class_assignments_assignment_type_enum" AS ENUM('teacher', 'bursar')`);
        await queryRunner.query(`CREATE TABLE "staff_class_assignments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "user_id" uuid NOT NULL, "class_arm_id" uuid NOT NULL, "session_id" uuid NOT NULL, "assignment_type" "public"."staff_class_assignments_assignment_type_enum" NOT NULL, "assigned_by" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_7a6f8e1f1ad10f38a0f10b8ee8a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c7a59e4615e97f4b1176d6b3ce" ON "staff_class_assignments"  ("user_id", "class_arm_id", "assignment_type", "session_id") `);
        await queryRunner.query(`ALTER TABLE "staff_class_assignments" ADD CONSTRAINT "FK_1db3352c0b987a939cf6cd79e48" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_class_assignments" ADD CONSTRAINT "FK_463a9f0af737d416a4e14cdf3ce" FOREIGN KEY ("class_arm_id") REFERENCES "class_arms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_class_assignments" ADD CONSTRAINT "FK_2ec431abb1cbbd2f12b323a5cfe" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_class_assignments" ADD CONSTRAINT "FK_d41eba4960aad30bfde00901c1e" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_class_assignments" DROP CONSTRAINT "FK_d41eba4960aad30bfde00901c1e"`);
        await queryRunner.query(`ALTER TABLE "staff_class_assignments" DROP CONSTRAINT "FK_2ec431abb1cbbd2f12b323a5cfe"`);
        await queryRunner.query(`ALTER TABLE "staff_class_assignments" DROP CONSTRAINT "FK_463a9f0af737d416a4e14cdf3ce"`);
        await queryRunner.query(`ALTER TABLE "staff_class_assignments" DROP CONSTRAINT "FK_1db3352c0b987a939cf6cd79e48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c7a59e4615e97f4b1176d6b3ce"`);
        await queryRunner.query(`DROP TABLE "staff_class_assignments"`);
        await queryRunner.query(`DROP TYPE "public"."staff_class_assignments_assignment_type_enum"`);
    }

}
