import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs) {
  await db.execute(sql`
    CREATE INDEX projects_english_search_idx ON projects USING GIN (
      to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
    ) WHERE _status = 'published';
    CREATE INDEX posts_english_search_idx ON posts USING GIN (
      to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
    ) WHERE _status = 'published';
    CREATE TABLE enquiry_limits (
      client text NOT NULL,
      window_start timestamptz NOT NULL,
      count integer NOT NULL CHECK (count > 0),
      PRIMARY KEY (client, window_start)
    );
    CREATE INDEX enquiry_limits_window_idx ON enquiry_limits (window_start);
  `)
}

export async function down({ db }: MigrateDownArgs) {
  await db.execute(sql`
    DROP TABLE enquiry_limits;
    DROP INDEX posts_english_search_idx;
    DROP INDEX projects_english_search_idx;
  `)
}

