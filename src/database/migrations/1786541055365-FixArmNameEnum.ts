import { MigrationInterface, QueryRunner } from "typeorm";

export class FixArmNameEnum1786541055365 implements MigrationInterface {
    name = 'FixArmNameEnum1786541055365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."class_arms_name_enum" RENAME TO "class_arms_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."class_arms_name_enum" AS ENUM('new_admission', 'mercury', 'venus', 'mars', 'jupiter', 'earth')`);
        await queryRunner.query(`ALTER TABLE "class_arms" ALTER COLUMN "name" TYPE "public"."class_arms_name_enum" USING "name"::"text"::"public"."class_arms_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."class_arms_name_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."class_arms_name_enum_old" AS ENUM('mercury', 'venus', 'mars', 'jupiter', 'earth', 'admission')`);
        await queryRunner.query(`ALTER TABLE "class_arms" ALTER COLUMN "name" TYPE "public"."class_arms_name_enum_old" USING "name"::"text"::"public"."class_arms_name_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."class_arms_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."class_arms_name_enum_old" RENAME TO "class_arms_name_enum"`);
    }

}
