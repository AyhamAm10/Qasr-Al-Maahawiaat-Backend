import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1736086480659 implements MigrationInterface {
    name = 'Test1736086480659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Recommended" ("id" SERIAL NOT NULL, "productId" integer, CONSTRAINT "REL_b7a4136ddee7e8712db9100ef0" UNIQUE ("productId"), CONSTRAINT "PK_b48d0147e3e7e8290f4144f2537" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "variations" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9e01de855f0f92ee838380a8c16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ProductData" ("id" SERIAL NOT NULL, "image" integer NOT NULL, "price_For_variation" double precision NOT NULL, "offer_for_variation" double precision, "product_id" integer, "variation_id" integer, CONSTRAINT "PK_adde399ca3be7fe2854596a91a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_order_type_enum" AS ENUM('delivery', 'takeaway', 'dine_in')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "delivery_fee" double precision NOT NULL, "valet" double precision NOT NULL, "subtotal" double precision NOT NULL, "total" double precision NOT NULL, "order_type" "public"."orders_order_type_enum" NOT NULL DEFAULT 'delivery', "table_number" integer, "lat" double precision, "long" double precision, "phone_number" character varying(15), "take_away_time" TIME, "street_address" character varying(255), "building_name" character varying(255), "apartment_number" character varying(50), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_products" ("id" SERIAL NOT NULL, "product_count" integer NOT NULL, "product_price" double precision NOT NULL, "product_id" integer, "order_id" integer, "variation_id" integer, CONSTRAINT "PK_3e59f094c2dc3310d585216a813" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "image_url" character varying(255) NOT NULL, "details" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "base_price" double precision NOT NULL, "offer_price" double precision, "category_id" integer, CONSTRAINT "PK_36a07cc432789830e7fb7b58a83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Categories" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "image_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Recommended" ADD CONSTRAINT "FK_b7a4136ddee7e8712db9100ef0f" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProductData" ADD CONSTRAINT "FK_3fed5388fc3a55b98d9f793c20f" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProductData" ADD CONSTRAINT "FK_1b5d8549cb8986baa78d550a087" FOREIGN KEY ("variation_id") REFERENCES "variations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD CONSTRAINT "FK_2d58e8bd11dc840b39f99824d84" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD CONSTRAINT "FK_f258ce2f670b34b38630914cf9e" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD CONSTRAINT "FK_b343b69a2ce1e8999e379395772" FOREIGN KEY ("variation_id") REFERENCES "variations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Products" ADD CONSTRAINT "FK_686fd033da4d2d5954daab89290" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Products" DROP CONSTRAINT "FK_686fd033da4d2d5954daab89290"`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP CONSTRAINT "FK_b343b69a2ce1e8999e379395772"`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP CONSTRAINT "FK_f258ce2f670b34b38630914cf9e"`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP CONSTRAINT "FK_2d58e8bd11dc840b39f99824d84"`);
        await queryRunner.query(`ALTER TABLE "ProductData" DROP CONSTRAINT "FK_1b5d8549cb8986baa78d550a087"`);
        await queryRunner.query(`ALTER TABLE "ProductData" DROP CONSTRAINT "FK_3fed5388fc3a55b98d9f793c20f"`);
        await queryRunner.query(`ALTER TABLE "Recommended" DROP CONSTRAINT "FK_b7a4136ddee7e8712db9100ef0f"`);
        await queryRunner.query(`DROP TABLE "Categories"`);
        await queryRunner.query(`DROP TABLE "Products"`);
        await queryRunner.query(`DROP TABLE "order_products"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_order_type_enum"`);
        await queryRunner.query(`DROP TABLE "ProductData"`);
        await queryRunner.query(`DROP TABLE "variations"`);
        await queryRunner.query(`DROP TABLE "Recommended"`);
    }

}
