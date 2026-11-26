import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header"
      ADD COLUMN IF NOT EXISTS "linkedin_url" varchar,
      ADD COLUMN IF NOT EXISTS "github_url" varchar,
      ADD COLUMN IF NOT EXISTS "whatsapp_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header"
      DROP COLUMN IF EXISTS "linkedin_url",
      DROP COLUMN IF EXISTS "github_url",
      DROP COLUMN IF EXISTS "whatsapp_url";
  `)
}
