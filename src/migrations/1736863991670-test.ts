import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1736863991670 implements MigrationInterface {
    name = 'Test1736863991670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Categories" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "translations" ADD "category_id" integer`);
        await queryRunner.query(`ALTER TABLE "translations" ADD CONSTRAINT "FK_9e175e57c6958bed509d1b16806" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "FK_9e175e57c6958bed509d1b16806"`);
        await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "Categories" ADD "name" character varying(255) NOT NULL`);
    }

}
