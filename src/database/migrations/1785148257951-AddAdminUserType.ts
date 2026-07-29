import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminUserType1785148257951 implements MigrationInterface {
    name = 'AddAdminUserType1785148257951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."users_type_enum" ADD VALUE 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_type_enum_old" AS ENUM('super_admin', 'bursar', 'teacher')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "type" TYPE "public"."users_type_enum_old" USING "type"::"text"::"public"."users_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_type_enum_old" RENAME TO "users_type_enum"`);
    }

}
