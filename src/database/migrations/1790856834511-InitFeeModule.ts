import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFeeModule1790856834511 implements MigrationInterface {
    name = 'InitFeeModule1790856834511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fee_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "name" character varying(255) NOT NULL, "description" text, "is_mandatory" boolean NOT NULL DEFAULT true, "is_active" boolean NOT NULL DEFAULT true, "created_by" uuid, CONSTRAINT "UQ_120e5f3ab607b0688a2765e2440" UNIQUE ("name"), CONSTRAINT "PK_04f6b37df364d3c8b06e957a59c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fee_structures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "fee_category_id" uuid NOT NULL, "class_arm_id" uuid, "class_id" uuid NOT NULL, "term_id" uuid NOT NULL, "session_id" uuid NOT NULL, "amount" numeric(10,2) NOT NULL, "due_date" date NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_by" uuid NOT NULL, CONSTRAINT "PK_d634078deb9cf5ceb5788ad9b53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."fee_discounts_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`CREATE TYPE "public"."fee_discounts_reason_enum" AS ENUM('staff_child', 'scholarship', 'early_payment', 'lost_parent', 'special_consideration')`);
        await queryRunner.query(`CREATE TABLE "fee_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "student_id" uuid NOT NULL, "fee_structure_id" uuid NOT NULL, "discount_type" "public"."fee_discounts_discount_type_enum" NOT NULL, "discount_value" numeric(10,2) NOT NULL, "reason" "public"."fee_discounts_reason_enum" NOT NULL, "approved_by" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_f6a215e6332ee7ca614a8613e83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fee_categories" ADD CONSTRAINT "FK_d042db97b1845c7d59be749e59c" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_structures" ADD CONSTRAINT "FK_f35c5fcab7764e8294c20147015" FOREIGN KEY ("fee_category_id") REFERENCES "fee_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_structures" ADD CONSTRAINT "FK_544c562e13fab30435d5a46cdea" FOREIGN KEY ("class_arm_id") REFERENCES "class_arms"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_structures" ADD CONSTRAINT "FK_e8d5f252faed8dfe19f49bbd780" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_structures" ADD CONSTRAINT "FK_d7d8e30868b0d3840e91dd59c88" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_structures" ADD CONSTRAINT "FK_edcd1c895a5fcde7d72700980ef" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_structures" ADD CONSTRAINT "FK_dc74a5e7ea6f8266a2fa325bd89" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_discounts" ADD CONSTRAINT "FK_8445dcd58e61c8a79cca149e21b" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_discounts" ADD CONSTRAINT "FK_865332e3756a2cbad6c99fdd814" FOREIGN KEY ("fee_structure_id") REFERENCES "fee_structures"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fee_discounts" ADD CONSTRAINT "FK_e8468c01268efd270e90ef03852" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fee_discounts" DROP CONSTRAINT "FK_e8468c01268efd270e90ef03852"`);
        await queryRunner.query(`ALTER TABLE "fee_discounts" DROP CONSTRAINT "FK_865332e3756a2cbad6c99fdd814"`);
        await queryRunner.query(`ALTER TABLE "fee_discounts" DROP CONSTRAINT "FK_8445dcd58e61c8a79cca149e21b"`);
        await queryRunner.query(`ALTER TABLE "fee_structures" DROP CONSTRAINT "FK_dc74a5e7ea6f8266a2fa325bd89"`);
        await queryRunner.query(`ALTER TABLE "fee_structures" DROP CONSTRAINT "FK_edcd1c895a5fcde7d72700980ef"`);
        await queryRunner.query(`ALTER TABLE "fee_structures" DROP CONSTRAINT "FK_d7d8e30868b0d3840e91dd59c88"`);
        await queryRunner.query(`ALTER TABLE "fee_structures" DROP CONSTRAINT "FK_e8d5f252faed8dfe19f49bbd780"`);
        await queryRunner.query(`ALTER TABLE "fee_structures" DROP CONSTRAINT "FK_544c562e13fab30435d5a46cdea"`);
        await queryRunner.query(`ALTER TABLE "fee_structures" DROP CONSTRAINT "FK_f35c5fcab7764e8294c20147015"`);
        await queryRunner.query(`ALTER TABLE "fee_categories" DROP CONSTRAINT "FK_d042db97b1845c7d59be749e59c"`);
        await queryRunner.query(`DROP TABLE "fee_discounts"`);
        await queryRunner.query(`DROP TYPE "public"."fee_discounts_reason_enum"`);
        await queryRunner.query(`DROP TYPE "public"."fee_discounts_discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "fee_structures"`);
        await queryRunner.query(`DROP TABLE "fee_categories"`);
    }

}
