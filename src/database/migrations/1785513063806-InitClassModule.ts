import { MigrationInterface, QueryRunner } from "typeorm";

export class InitClassModule1785513063806 implements MigrationInterface {
    name = 'InitClassModule1785513063806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."class_arms_name_enum" AS ENUM('mercury', 'venus', 'mars', 'jupiter', 'earth')`);
        await queryRunner.query(`CREATE TABLE "class_arms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "class_id" uuid NOT NULL, "name" "public"."class_arms_name_enum" NOT NULL, "form_teacher_id" uuid, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_e3048b97c7d9b5f334ecd03deff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."classes_category_enum" AS ENUM('pre_nursery', 'nursery', 'primary', 'jss', 'ss')`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "name" character varying(255) NOT NULL, "level" integer NOT NULL, "category" "public"."classes_category_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_1f3940af28a76098f31004f03ca" UNIQUE ("name"), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "class_arms" ADD CONSTRAINT "FK_3bb5d5d3d5bad5fd3456433988a" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_arms" ADD CONSTRAINT "FK_a1c02fdb0772f6d1ead977c5d7d" FOREIGN KEY ("form_teacher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_arms" DROP CONSTRAINT "FK_a1c02fdb0772f6d1ead977c5d7d"`);
        await queryRunner.query(`ALTER TABLE "class_arms" DROP CONSTRAINT "FK_3bb5d5d3d5bad5fd3456433988a"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TYPE "public"."classes_category_enum"`);
        await queryRunner.query(`DROP TABLE "class_arms"`);
        await queryRunner.query(`DROP TYPE "public"."class_arms_name_enum"`);
    }

}
