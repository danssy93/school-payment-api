import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserRemoveRefreshTokenTable1785403477294 implements MigrationInterface {
    name = 'UpdateUserRemoveRefreshTokenTable1785403477294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_picture" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_login" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_picture"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
    }

}
