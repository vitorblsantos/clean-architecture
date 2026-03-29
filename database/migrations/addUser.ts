import { MigrationInterface, QueryRunner } from 'typeorm'

// 2026-03-29

export class addUser1774808948434 implements MigrationInterface {
  name = 'addUser1774808948434'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_user_id" PRIMARY KEY ("id"), CONSTRAINT "UQ_user_name" UNIQUE ("name"))`,
    )
    await queryRunner.query(
      `INSERT INTO "public"."user" ("id", "name") VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'John Doe')`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "public"."user"`)
  }
}
