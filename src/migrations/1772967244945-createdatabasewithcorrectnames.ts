import { MigrationInterface, QueryRunner } from "typeorm";

export class Createdatabasewithcorrectnames1772967244945 implements MigrationInterface {
    name = 'Createdatabasewithcorrectnames1772967244945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer, CONSTRAINT "UQ_74b9b8cd79a1014e50135f266fe" UNIQUE ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tag" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_0b4ef8e83392129fb3373fdb3af" UNIQUE ("tag"))`);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "postId" integer, "hashtagId" integer)`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer)`);
        await queryRunner.query(`CREATE INDEX "IDX_c5a322ad12a7bf95460c958e80" ON "posts" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_60818528127866f5002e7f826d" ON "posts" ("created_at") `);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer, CONSTRAINT "UQ_105079775692df1f8799ed0fac8" UNIQUE ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer, CONSTRAINT "UQ_74b9b8cd79a1014e50135f266fe" UNIQUE ("userId", "postId"), CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e2fe567ad8d305fefc918d44f50" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_likes"("id", "created_at", "userId", "postId") SELECT "id", "created_at", "userId", "postId" FROM "likes"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`ALTER TABLE "temporary_likes" RENAME TO "likes"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "postId" integer, "hashtagId" integer, CONSTRAINT "FK_003e77538237089ff217a1cfe74" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_31c935be539e76295a7f1c632aa" FOREIGN KEY ("hashtagId") REFERENCES "hashtags" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post_hashtags"("id", "postId", "hashtagId") SELECT "id", "postId", "hashtagId" FROM "post_hashtags"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_hashtags" RENAME TO "post_hashtags"`);
        await queryRunner.query(`DROP INDEX "IDX_c5a322ad12a7bf95460c958e80"`);
        await queryRunner.query(`DROP INDEX "IDX_60818528127866f5002e7f826d"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer, CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "content", "created_at", "updated_at", "authorId") SELECT "id", "content", "created_at", "updated_at", "authorId" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_c5a322ad12a7bf95460c958e80" ON "posts" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_60818528127866f5002e7f826d" ON "posts" ("created_at") `);
        await queryRunner.query(`CREATE TABLE "temporary_follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer, CONSTRAINT "UQ_105079775692df1f8799ed0fac8" UNIQUE ("followerId", "followingId"), CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_follows"("id", "created_at", "followerId", "followingId") SELECT "id", "created_at", "followerId", "followingId" FROM "follows"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`ALTER TABLE "temporary_follows" RENAME TO "follows"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" RENAME TO "temporary_follows"`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer, CONSTRAINT "UQ_105079775692df1f8799ed0fac8" UNIQUE ("followerId", "followingId"))`);
        await queryRunner.query(`INSERT INTO "follows"("id", "created_at", "followerId", "followingId") SELECT "id", "created_at", "followerId", "followingId" FROM "temporary_follows"`);
        await queryRunner.query(`DROP TABLE "temporary_follows"`);
        await queryRunner.query(`DROP INDEX "IDX_60818528127866f5002e7f826d"`);
        await queryRunner.query(`DROP INDEX "IDX_c5a322ad12a7bf95460c958e80"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer)`);
        await queryRunner.query(`INSERT INTO "posts"("id", "content", "created_at", "updated_at", "authorId") SELECT "id", "content", "created_at", "updated_at", "authorId" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_60818528127866f5002e7f826d" ON "posts" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5a322ad12a7bf95460c958e80" ON "posts" ("authorId") `);
        await queryRunner.query(`ALTER TABLE "post_hashtags" RENAME TO "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "postId" integer, "hashtagId" integer)`);
        await queryRunner.query(`INSERT INTO "post_hashtags"("id", "postId", "hashtagId") SELECT "id", "postId", "hashtagId" FROM "temporary_post_hashtags"`);
        await queryRunner.query(`DROP TABLE "temporary_post_hashtags"`);
        await queryRunner.query(`ALTER TABLE "likes" RENAME TO "temporary_likes"`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer, CONSTRAINT "UQ_74b9b8cd79a1014e50135f266fe" UNIQUE ("userId", "postId"))`);
        await queryRunner.query(`INSERT INTO "likes"("id", "created_at", "userId", "postId") SELECT "id", "created_at", "userId", "postId" FROM "temporary_likes"`);
        await queryRunner.query(`DROP TABLE "temporary_likes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP INDEX "IDX_60818528127866f5002e7f826d"`);
        await queryRunner.query(`DROP INDEX "IDX_c5a322ad12a7bf95460c958e80"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
        await queryRunner.query(`DROP TABLE "likes"`);
    }

}
