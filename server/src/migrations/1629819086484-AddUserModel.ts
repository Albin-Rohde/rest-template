import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserModel1629819086484 implements MigrationInterface {
    name = 'AddUserModel1629819086484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_65edadc946a7faf4b638d5e8885" UNIQUE ("id"), CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8" UNIQUE ("username"), CONSTRAINT "UQ_19b3d69e0f058936531e3965b77" UNIQUE ("email"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "username_idx" ON "player" ("username") `);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "UQ_65edadc946a7faf4b638d5e8885" UNIQUE ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "UQ_65edadc946a7faf4b638d5e8885"`);
        await queryRunner.query(`DROP INDEX "username_idx"`);
        await queryRunner.query(`DROP TABLE "player"`);
    }

}
