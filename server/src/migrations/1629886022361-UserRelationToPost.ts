import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRelationToPost1629886022361 implements MigrationInterface {
    name = 'UserRelationToPost1629886022361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."post" ADD "user_id_fk" integer`);
        await queryRunner.query(`ALTER TABLE "public"."post" ADD CONSTRAINT "FK_e6f9c1b764f7e53806189e5a63c" FOREIGN KEY ("user_id_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."post" DROP CONSTRAINT "FK_e6f9c1b764f7e53806189e5a63c"`);
        await queryRunner.query(`ALTER TABLE "public"."post" DROP COLUMN "user_id_fk"`);
    }

}
