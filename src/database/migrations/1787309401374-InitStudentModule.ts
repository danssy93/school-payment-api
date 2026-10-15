import { MigrationInterface, QueryRunner } from "typeorm";

export class InitStudentModule1787309401374 implements MigrationInterface {
    name = 'InitStudentModule1787309401374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admission_number_sequences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "prefix" character varying(20) NOT NULL, "year" integer NOT NULL, "current_number" integer NOT NULL DEFAULT '0', "padding" integer NOT NULL DEFAULT '4', CONSTRAINT "UQ_admission_prefix_year" UNIQUE ("prefix", "year"), CONSTRAINT "PK_ba3d2f8bc9e7004a579219d6722" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_enrollment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "student_id" uuid NOT NULL, "class_arm_id" uuid NOT NULL, "session_id" uuid NOT NULL, "term_id" uuid, "enrolled_by" uuid NOT NULL, "enrollment_date" TIMESTAMP(6) NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8d2ebd470040ec79545843248c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_student_active_enrollment_session" ON "student_enrollment" ("student_id", "session_id") WHERE "is_active" = true AND "deleted_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "students" ADD "admission_no" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "UQ_60be61f5398fa190f5808f0bc03" UNIQUE ("admission_no")`);
        await queryRunner.query(`ALTER TABLE "students" ADD "first_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "students" ADD "middle_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "students" ADD "last_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "students" ADD "date_of_birth" date NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."students_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`ALTER TABLE "students" ADD "gender" "public"."students_gender_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "students" ADD "profile_photo_url" character varying`);
        await queryRunner.query(`ALTER TABLE "students" ADD "guardian_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "students" ADD "previous_school" character varying(255)`);
        await queryRunner.query(`CREATE TYPE "public"."students_blood_group_enum" AS ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')`);
        await queryRunner.query(`ALTER TABLE "students" ADD "blood_group" "public"."students_blood_group_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."students_genotype_enum" AS ENUM('AA', 'AS', 'SS', 'AC')`);
        await queryRunner.query(`ALTER TABLE "students" ADD "genotype" "public"."students_genotype_enum"`);
        await queryRunner.query(`ALTER TABLE "students" ADD "health_notes" text`);
        await queryRunner.query(`CREATE TYPE "public"."students_student_status_enum" AS ENUM('active', 'graduated', 'withdrawn', 'suspended', 'expelled', 'alumni')`);
        await queryRunner.query(`ALTER TABLE "students" ADD "student_status" "public"."students_student_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "students" ADD "status_reason" text`);
        await queryRunner.query(`ALTER TABLE "students" ADD "registered_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "first_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "middle_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "last_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "phone_no" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD CONSTRAINT "UQ_320783c777a63f838d42fd3493e" UNIQUE ("phone_no")`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "whatsapp_no" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "email" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD CONSTRAINT "UQ_2822ea52513239fdd508c016e3b" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "occupation" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "home_address" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "work_address" text`);
        await queryRunner.query(`CREATE TYPE "public"."guardians_relationship_enum" AS ENUM('father', 'mother', 'uncle', 'aunt', 'grandfather', 'grandmother', 'other')`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "relationship" "public"."guardians_relationship_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" ADD CONSTRAINT "FK_78dd0b8da7349f673af99a5a631" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" ADD CONSTRAINT "FK_b6d360b0c4e8a403c30871c71a9" FOREIGN KEY ("class_arm_id") REFERENCES "class_arms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" ADD CONSTRAINT "FK_a0a2e773628a15279acf3df7d4e" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" ADD CONSTRAINT "FK_9ff8f050d029a694eef2e49dd8c" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" ADD CONSTRAINT "FK_c3e615b25186c52e4c2d37a639d" FOREIGN KEY ("enrolled_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_bb4d7666efc93915ddb84745244" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "public"."class_arms_type_enum" AS ENUM('new_admission', 'regular')`);
        await queryRunner.query(`ALTER TABLE "class_arms" ADD "type" "public"."class_arms_type_enum" NOT NULL DEFAULT 'regular'`);
        await queryRunner.query(`UPDATE "class_arms" SET "type" = 'new_admission' WHERE "name" = 'new_admission'`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_46db8a8e067ac737e8bfaadec25" FOREIGN KEY ("registered_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_46db8a8e067ac737e8bfaadec25"`);
        await queryRunner.query(`ALTER TABLE "class_arms" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."class_arms_type_enum"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_bb4d7666efc93915ddb84745244"`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" DROP CONSTRAINT "FK_c3e615b25186c52e4c2d37a639d"`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" DROP CONSTRAINT "FK_9ff8f050d029a694eef2e49dd8c"`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" DROP CONSTRAINT "FK_a0a2e773628a15279acf3df7d4e"`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" DROP CONSTRAINT "FK_b6d360b0c4e8a403c30871c71a9"`);
        await queryRunner.query(`ALTER TABLE "student_enrollment" DROP CONSTRAINT "FK_78dd0b8da7349f673af99a5a631"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "relationship"`);
        await queryRunner.query(`DROP TYPE "public"."guardians_relationship_enum"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "work_address"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "home_address"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "occupation"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP CONSTRAINT "UQ_2822ea52513239fdd508c016e3b"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "whatsapp_no"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP CONSTRAINT "UQ_320783c777a63f838d42fd3493e"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "phone_no"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "middle_name"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "registered_by"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "status_reason"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "student_status"`);
        await queryRunner.query(`DROP TYPE "public"."students_student_status_enum"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "health_notes"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "genotype"`);
        await queryRunner.query(`DROP TYPE "public"."students_genotype_enum"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "blood_group"`);
        await queryRunner.query(`DROP TYPE "public"."students_blood_group_enum"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "previous_school"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "guardian_id"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "profile_photo_url"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."students_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "middle_name"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "UQ_60be61f5398fa190f5808f0bc03"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "admission_no"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_student_active_enrollment_session"`);
        await queryRunner.query(`DROP TABLE "student_enrollment"`);
        await queryRunner.query(`DROP TABLE "admission_number_sequences"`);
    }

}
