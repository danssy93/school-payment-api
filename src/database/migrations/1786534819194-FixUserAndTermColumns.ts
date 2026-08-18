import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserAndTermColumns1786534819194 implements MigrationInterface {
  name = 'FixUserAndTermColumns1786534819194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terms" DROP CONSTRAINT "FK_8add152a82c044000851307bd0a"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "middle_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "sessionId"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "full_name" character varying(100)`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "full_name" = 'Admin' WHERE "full_name" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "full_name" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TYPE "public"."terms_status_enum" RENAME TO "terms_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."terms_status_enum" AS ENUM('upcoming', 'active', 'complete')`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ALTER COLUMN "status" TYPE "public"."terms_status_enum" USING "status"::"text"::"public"."terms_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ALTER COLUMN "status" SET DEFAULT 'upcoming'`,
    );
    await queryRunner.query(`DROP TYPE "public"."terms_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."academic_sessions_status_enum" RENAME TO "academic_sessions_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_sessions_status_enum" AS ENUM('upcoming', 'active', 'completed', 'locked', 'inactive')`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_sessions" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_sessions" ALTER COLUMN "status" TYPE "public"."academic_sessions_status_enum" USING "status"::"text"::"public"."academic_sessions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_sessions" ALTER COLUMN "status" SET DEFAULT 'upcoming'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_sessions_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ADD CONSTRAINT "FK_2a45e5f1a157f965dad749ef1dd" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terms" DROP CONSTRAINT "FK_2a45e5f1a157f965dad749ef1dd"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_sessions_status_enum_old" AS ENUM('0', '1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_sessions" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_sessions" ALTER COLUMN "status" TYPE "public"."academic_sessions_status_enum_old" USING "status"::"text"::"public"."academic_sessions_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_sessions" ALTER COLUMN "status" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."academic_sessions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."academic_sessions_status_enum_old" RENAME TO "academic_sessions_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."terms_status_enum_old" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ALTER COLUMN "status" TYPE "public"."terms_status_enum_old" USING "status"::"text"::"public"."terms_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ALTER COLUMN "status" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TYPE "public"."terms_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."terms_status_enum_old" RENAME TO "terms_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);
    await queryRunner.query(`ALTER TABLE "terms" ADD "sessionId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "middle_name" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_name" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms" ADD CONSTRAINT "FK_8add152a82c044000851307bd0a" FOREIGN KEY ("sessionId") REFERENCES "academic_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
