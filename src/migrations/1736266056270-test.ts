import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1736266056270 implements MigrationInterface {
    name = 'Test1736266056270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "restaurant_tool" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "available" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_aad4b2d352996e343c0b41c885d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_restaurant_tool" ("id" SERIAL NOT NULL, "reservedQuantity" integer NOT NULL DEFAULT '0', "userId" integer, "restaurantToolId" integer, CONSTRAINT "PK_06f991f3148ac06aff59c4d1fc1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "jobTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "startDate" date`);
        await queryRunner.query(`ALTER TABLE "user" ADD "endDate" date`);
        await queryRunner.query(`ALTER TABLE "user" ADD "residencyValidity" date`);
        await queryRunner.query(`ALTER TABLE "user" ADD "fines" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "discounts" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "loans" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "salary" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "vacationDays" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "weeklyHolidays" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "sickDays" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('super admin', 'data entry', 'HR', 'Customer')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'data entry'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user_restaurant_tool" ADD CONSTRAINT "FK_1cf897bbe267b12bfaa1d8d51bb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_restaurant_tool" ADD CONSTRAINT "FK_dccee7c594db334809b6cef12b0" FOREIGN KEY ("restaurantToolId") REFERENCES "restaurant_tool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_restaurant_tool" DROP CONSTRAINT "FK_dccee7c594db334809b6cef12b0"`);
        await queryRunner.query(`ALTER TABLE "user_restaurant_tool" DROP CONSTRAINT "FK_1cf897bbe267b12bfaa1d8d51bb"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('super admin', 'data entry', 'HR')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'data entry'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sickDays"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "weeklyHolidays"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "vacationDays"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "salary"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "loans"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "discounts"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fines"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "residencyValidity"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "jobTitle"`);
        await queryRunner.query(`DROP TABLE "user_restaurant_tool"`);
        await queryRunner.query(`DROP TABLE "restaurant_tool"`);
    }

}
