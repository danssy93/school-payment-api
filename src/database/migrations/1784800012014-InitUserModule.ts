import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUserModule1784800012014 implements MigrationInterface {
    name = 'InitUserModule1784800012014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_type_enum" AS ENUM('super_admin', 'bursar', 'teacher')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'in-active', 'suspended')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "full_name" character varying(100) NOT NULL, "user_name" character varying(50) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "type" "public"."users_type_enum" NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(6), "token" character varying NOT NULL, "expires_at" TIMESTAMP(6), "revoked" boolean NOT NULL DEFAULT false, "user_id" uuid, CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
    }

}
