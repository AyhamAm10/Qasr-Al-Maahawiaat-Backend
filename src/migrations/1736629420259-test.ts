import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1736629420259 implements MigrationInterface {
    name = 'Test1736629420259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translations" ADD "product_id" integer`);
        await queryRunner.query(`ALTER TABLE "translations" ADD CONSTRAINT "FK_dcfd865bfac679e3230bad605d8" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "FK_dcfd865bfac679e3230bad605d8"`);
        await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "product_id"`);
    }

}
