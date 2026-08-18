import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSessionModule1786470908890 implements MigrationInterface {
  name = 'InitSessionModule1786470908890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "guardians" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), CONSTRAINT "PK_3dcf02f3dc96a2c017106f280be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."terms_name_enum" AS ENUM('first_term', 'second_term', 'third_term')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."terms_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "terms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "session_id" uuid NOT NULL, "name" "public"."terms_name_enum" NOT NULL DEFAULT 'first_term', "start_date" date NOT NULL, "end_date" date NOT NULL, "status" "public"."terms_status_enum" NOT NULL DEFAULT '0', "sessionId" uuid, CONSTRAINT "PK_33b6fe77d6ace7ff43cc8a65958" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_sessions_status_enum" AS ENUM('0', '1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `CREATE TABLE "academic_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "name" character varying(255) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "status" "public"."academic_sessions_status_enum" NOT NULL DEFAULT '0', "is_locked" boolean NOT NULL DEFAULT false, "created_by" uuid NOT NULL, CONSTRAINT "UQ_5557c033f7a596c8ea80f741841" UNIQUE ("name"), CONSTRAINT "PK_8dba9ed9bef819af7a31769c04b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);

    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_name" character varying(100)`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "first_name" = 'Admin' WHERE "first_name" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ADD "middle_name" character varying(100)`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "middle_name" = 'Admin' WHERE "middle_name" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "middle_name" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" character varying(100)`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "last_name" = 'Admin' WHERE "last_name" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TYPE "public"."class_arms_name_enum" ADD VALUE 'admission'`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ADD CONSTRAINT "FK_8add152a82c044000851307bd0a" FOREIGN KEY ("sessionId") REFERENCES "academic_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_sessions" ADD CONSTRAINT "FK_b83ce55e01cf4da1f4d69b97e00" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic_sessions" DROP CONSTRAINT "FK_b83ce55e01cf4da1f4d69b97e00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" DROP CONSTRAINT "FK_8add152a82c044000851307bd0a"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."class_arms_name_enum_old" AS ENUM('mercury', 'venus', 'mars', 'jupiter', 'earth')`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_arms" ALTER COLUMN "name" TYPE "public"."class_arms_name_enum_old" USING "name"::"text"::"public"."class_arms_name_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."class_arms_name_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."class_arms_name_enum_old" RENAME TO "class_arms_name_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "middle_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "full_name" character varying(100) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TABLE "academic_sessions"`);
    await queryRunner.query(
      `DROP TYPE "public"."academic_sessions_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "terms"`);
    await queryRunner.query(`DROP TYPE "public"."terms_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."terms_name_enum"`);
    await queryRunner.query(`DROP TABLE "guardians"`);
  }
}
