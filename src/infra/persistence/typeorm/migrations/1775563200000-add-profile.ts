import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProfile1775563200000 implements MigrationInterface {
  name = 'AddProfile1775563200000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."profiles" ("id" character varying NOT NULL, "name" character varying NOT NULL, "lastname" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0fb22df1705f67ccc5b43ac1433" PRIMARY KEY ("id"), CONSTRAINT "UQ_0fb22df1705f67ccc5b43ac1433" UNIQUE ("id"))`,
    )
    await queryRunner.query(
      `INSERT INTO "public"."profiles" ("id", "name", "lastname") VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'John', 'Doe')`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "public"."profiles"`)
  }
}
