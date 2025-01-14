import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1736627107455 implements MigrationInterface {
    name = 'Test1736627107455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "translations" ("id" SERIAL NOT NULL, "entity" character varying(50) NOT NULL, "entityId" integer NOT NULL, "language" character varying(10) NOT NULL, "key" character varying(50) NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_aca248c72ae1fb2390f1bf4cd87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5a1922c42af86a9f165ae64f83" ON "translations" ("entity") `);
        await queryRunner.query(`CREATE INDEX "IDX_37b1b46ff11f0c882df9c4ccc8" ON "translations" ("language") `);
        await queryRunner.query(`CREATE INDEX "IDX_53f09a1414bace37a1b821bf1b" ON "translations" ("key") `);
        await queryRunner.query(`ALTER TABLE "Products" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "Products" DROP COLUMN "details"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Products" ADD "details" text`);
        await queryRunner.query(`ALTER TABLE "Products" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53f09a1414bace37a1b821bf1b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37b1b46ff11f0c882df9c4ccc8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a1922c42af86a9f165ae64f83"`);
        await queryRunner.query(`DROP TABLE "translations"`);
    }

}
