import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header"
      ADD COLUMN IF NOT EXISTS "linkedin_u_r_l" varchar,
      ADD COLUMN IF NOT EXISTS "github_u_r_l" varchar,
      ADD COLUMN IF NOT EXISTS "whatsapp_u_r_l" varchar;

    UPDATE "header"
    SET
      "linkedin_u_r_l" = COALESCE("linkedin_u_r_l", "linkedin_url"),
      "github_u_r_l" = COALESCE("github_u_r_l", "github_url"),
      "whatsapp_u_r_l" = COALESCE("whatsapp_u_r_l", "whatsapp_url");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header"
      DROP COLUMN IF EXISTS "linkedin_u_r_l",
      DROP COLUMN IF EXISTS "github_u_r_l",
      DROP COLUMN IF EXISTS "whatsapp_u_r_l";
  `)
}
