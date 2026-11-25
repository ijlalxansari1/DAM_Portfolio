import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_projects_visual" AS ENUM('migration', 'workflow', 'archive', 'rights');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_visual" AS ENUM('migration', 'workflow', 'archive', 'rights');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_kind" AS ENUM('article', 'research');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_kind" AS ENUM('article', 'research');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_approval" AS ENUM('pending', 'approved', 'retired');
  CREATE TYPE "public"."enum_media_confidentiality" AS ENUM('public', 'internal', 'restricted');
  CREATE TYPE "public"."enum_media_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum_organisations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__organisations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_experience_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experience_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_education_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__education_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_certifications_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__certifications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_expertise_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__expertise_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_platforms_proficiency" AS ENUM('expert', 'working knowledge', 'standard', 'tool');
  CREATE TYPE "public"."enum_platforms_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__platforms_v_version_proficiency" AS ENUM('expert', 'working knowledge', 'standard', 'tool');
  CREATE TYPE "public"."enum__platforms_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_metrics_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__metrics_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tags_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tags_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_authors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__authors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lab_assets_kind" AS ENUM('Image', 'Document', 'Audio', 'Video');
  CREATE TYPE "public"."enum_lab_assets_visual" AS ENUM('ridge', 'field', 'folio', 'sound', 'pattern', 'water');
  CREATE TYPE "public"."enum_lab_assets_state" AS ENUM('Intake', 'Review', 'Approved', 'Restricted');
  CREATE TYPE "public"."enum_lab_assets_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lab_assets_v_version_kind" AS ENUM('Image', 'Document', 'Audio', 'Video');
  CREATE TYPE "public"."enum__lab_assets_v_version_visual" AS ENUM('ridge', 'field', 'folio', 'sound', 'pattern', 'water');
  CREATE TYPE "public"."enum__lab_assets_v_version_state" AS ENUM('Intake', 'Review', 'Approved', 'Restricted');
  CREATE TYPE "public"."enum__lab_assets_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_taxonomy_terms_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__taxonomy_terms_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lab_workflows_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lab_workflows_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'reviewed', 'closed');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302', '307', '308');
  CREATE TYPE "public"."enum_homepage_blocks_hero_layout" AS ENUM('balanced', 'wide-diagram');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_blocks_hero_layout" AS ENUM('balanced', 'wide-diagram');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lab_settings_default_view" AS ENUM('library', 'taxonomy', 'workflow');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_methodology" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"organisation_id" integer,
  	"period" varchar,
  	"cover_id" integer,
  	"challenge" varchar,
  	"outcomes" varchar,
  	"visual" "enum_projects_visual" DEFAULT 'archive',
  	"show_migration_diagram" boolean,
  	"published_at" timestamp(3) with time zone,
  	"revised_at" timestamp(3) with time zone,
  	"canonical_u_r_l" varchar,
  	"no_index" boolean DEFAULT false,
  	"last_published_slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"platforms_id" integer,
  	"metrics_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "_projects_v_version_methodology" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_organisation_id" integer,
  	"version_period" varchar,
  	"version_cover_id" integer,
  	"version_challenge" varchar,
  	"version_outcomes" varchar,
  	"version_visual" "enum__projects_v_version_visual" DEFAULT 'archive',
  	"version_show_migration_diagram" boolean,
  	"version_published_at" timestamp(3) with time zone,
  	"version_revised_at" timestamp(3) with time zone,
  	"version_canonical_u_r_l" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_last_published_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"platforms_id" integer,
  	"metrics_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "posts_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"author_id" integer,
  	"kind" "enum_posts_kind" DEFAULT 'article',
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"revised_at" timestamp(3) with time zone,
  	"canonical_u_r_l" varchar,
  	"no_index" boolean DEFAULT false,
  	"last_published_slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v_version_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_author_id" integer,
  	"version_kind" "enum__posts_v_version_kind" DEFAULT 'article',
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_revised_at" timestamp(3) with time zone,
  	"version_canonical_u_r_l" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_last_published_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"transcript" varchar,
  	"archive_collection" varchar,
  	"category_id" integer,
  	"creator" varchar,
  	"copyright_holder" varchar,
  	"licence" varchar NOT NULL,
  	"attribution" varchar,
  	"permitted_usage" varchar,
  	"expiry" timestamp(3) with time zone,
  	"checksum" varchar,
  	"uploader_id" integer,
  	"approval" "enum_media_approval" DEFAULT 'pending',
  	"confidentiality" "enum_media_confidentiality" DEFAULT 'internal',
  	"visibility" "enum_media_visibility" DEFAULT 'private',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"taxonomy_terms_id" integer
  );
  
  CREATE TABLE "organisations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"logo_id" integer,
  	"website" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_organisations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_organisations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_logo_id" integer,
  	"version_website" varchar,
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__organisations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "experience_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "experience" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"organisation_id" integer,
  	"start" timestamp(3) with time zone,
  	"end" timestamp(3) with time zone,
  	"period" varchar,
  	"sort_order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_experience_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_experience_v_version_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_experience_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_role" varchar,
  	"version_organisation_id" integer,
  	"version_start" timestamp(3) with time zone,
  	"version_end" timestamp(3) with time zone,
  	"version_period" varchar,
  	"version_sort_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__experience_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "education" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"degree" varchar,
  	"institution_id" integer,
  	"start" timestamp(3) with time zone,
  	"end" timestamp(3) with time zone,
  	"period" varchar,
  	"distinction" varchar,
  	"highlight" varchar,
  	"sort_order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_education_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_education_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_degree" varchar,
  	"version_institution_id" integer,
  	"version_start" timestamp(3) with time zone,
  	"version_end" timestamp(3) with time zone,
  	"version_period" varchar,
  	"version_distinction" varchar,
  	"version_highlight" varchar,
  	"version_sort_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__education_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "certifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"issuer" varchar,
  	"date" timestamp(3) with time zone,
  	"verification_u_r_l" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_certifications_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_certifications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_issuer" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_verification_u_r_l" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__certifications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "expertise" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"category_id" integer,
  	"sort_order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_expertise_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "expertise_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_expertise_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_description" varchar,
  	"version_category_id" integer,
  	"version_sort_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__expertise_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_expertise_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "platforms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"proficiency" "enum_platforms_proficiency",
  	"category" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_platforms_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "platforms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_platforms_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_proficiency" "enum__platforms_v_version_proficiency",
  	"version_category" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__platforms_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_platforms_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "metrics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"value" numeric,
  	"unit" varchar,
  	"display" varchar,
  	"context" varchar,
  	"source" varchar,
  	"project_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_metrics_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_metrics_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_value" numeric,
  	"version_unit" varchar,
  	"version_display" varchar,
  	"version_context" varchar,
  	"version_source" varchar,
  	"version_project_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__metrics_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tags_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"taxonomy_terms_id" integer
  );
  
  CREATE TABLE "_tags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tags_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"taxonomy_terms_id" integer
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"biography" varchar,
  	"portrait_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_authors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_authors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_biography" varchar,
  	"version_portrait_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__authors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "lab_assets_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "lab_assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"record_id" varchar,
  	"archive_collection" varchar,
  	"description" varchar,
  	"kind" "enum_lab_assets_kind" DEFAULT 'Image',
  	"visual" "enum_lab_assets_visual" DEFAULT 'folio',
  	"creator" varchar,
  	"rights_holder" varchar,
  	"licence" varchar,
  	"expiry" timestamp(3) with time zone,
  	"language" varchar,
  	"state" "enum_lab_assets_state" DEFAULT 'Intake',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lab_assets_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "lab_assets_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"taxonomy_terms_id" integer
  );
  
  CREATE TABLE "_lab_assets_v_version_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_lab_assets_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_record_id" varchar,
  	"version_archive_collection" varchar,
  	"version_description" varchar,
  	"version_kind" "enum__lab_assets_v_version_kind" DEFAULT 'Image',
  	"version_visual" "enum__lab_assets_v_version_visual" DEFAULT 'folio',
  	"version_creator" varchar,
  	"version_rights_holder" varchar,
  	"version_licence" varchar,
  	"version_expiry" timestamp(3) with time zone,
  	"version_language" varchar,
  	"version_state" "enum__lab_assets_v_version_state" DEFAULT 'Intake',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lab_assets_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_lab_assets_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"taxonomy_terms_id" integer
  );
  
  CREATE TABLE "taxonomy_terms_synonyms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "taxonomy_terms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_taxonomy_terms_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "taxonomy_terms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"taxonomy_terms_id" integer
  );
  
  CREATE TABLE "_taxonomy_terms_v_version_synonyms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_taxonomy_terms_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__taxonomy_terms_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_taxonomy_terms_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"taxonomy_terms_id" integer
  );
  
  CREATE TABLE "lab_workflows_stages_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "lab_workflows_stages_transitions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target" varchar
  );
  
  CREATE TABLE "lab_workflows_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "lab_workflows" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lab_workflows_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_lab_workflows_v_version_stages_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_lab_workflows_v_version_stages_transitions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"target" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_lab_workflows_v_version_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_lab_workflows_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lab_workflows_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new',
  	"rate_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" DEFAULT '301' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"organisations_id" integer,
  	"experience_id" integer,
  	"education_id" integer,
  	"certifications_id" integer,
  	"expertise_id" integer,
  	"platforms_id" integer,
  	"metrics_id" integer,
  	"categories_id" integer,
  	"tags_id" integer,
  	"authors_id" integer,
  	"lab_assets_id" integer,
  	"taxonomy_terms_id" integer,
  	"lab_workflows_id" integer,
  	"enquiries_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_label" varchar,
  	"secondary_href" varchar,
  	"layout" "enum_homepage_blocks_hero_layout" DEFAULT 'balanced',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_impact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"projects_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_expertise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_lab" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_platforms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_insights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_career" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"metrics_id" integer,
  	"projects_id" integer,
  	"expertise_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_homepage_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_label" varchar,
  	"secondary_href" varchar,
  	"layout" "enum__homepage_v_blocks_hero_layout" DEFAULT 'balanced',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_impact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"projects_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_expertise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_lab" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_platforms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_insights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_career" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"metrics_id" integer,
  	"projects_id" integer,
  	"expertise_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Khalid Ansari' NOT NULL,
  	"title" varchar DEFAULT 'Digital Asset Management, Metadata Governance & Content Operations Specialist' NOT NULL,
  	"location" varchar DEFAULT 'London, United Kingdom' NOT NULL,
  	"biography" varchar,
  	"portrait_id" integer,
  	"cv_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Khalid Ansari' NOT NULL,
  	"subtitle" varchar DEFAULT 'The Intelligent Archive',
  	"cta_label" varchar DEFAULT 'Get in touch' NOT NULL,
  	"cta_href" varchar DEFAULT '/#contact' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"descriptor" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"privacy_intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_title" varchar,
  	"default_description" varchar,
  	"social_image_id" integer,
  	"allow_indexing" boolean DEFAULT true,
  	"google_verification" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "lab_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"dataset_notice" varchar,
  	"default_view" "enum_lab_settings_default_view" DEFAULT 'library',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enquiry_heading" varchar,
  	"enquiry_description" varchar,
  	"form_enabled" boolean DEFAULT true,
  	"public_email" varchar,
  	"professional_u_r_l" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_methodology" ADD CONSTRAINT "projects_methodology_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_platforms_fk" FOREIGN KEY ("platforms_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_metrics_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_methodology" ADD CONSTRAINT "_projects_v_version_methodology_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_organisation_id_organisations_id_fk" FOREIGN KEY ("version_organisation_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_platforms_fk" FOREIGN KEY ("platforms_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_metrics_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_references" ADD CONSTRAINT "posts_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_references" ADD CONSTRAINT "_posts_v_version_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_taxonomy_terms_fk" FOREIGN KEY ("taxonomy_terms_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organisations" ADD CONSTRAINT "organisations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organisations_v" ADD CONSTRAINT "_organisations_v_parent_id_organisations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organisations_v" ADD CONSTRAINT "_organisations_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experience_responsibilities" ADD CONSTRAINT "experience_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experience" ADD CONSTRAINT "experience_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experience_v_version_responsibilities" ADD CONSTRAINT "_experience_v_version_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_experience_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experience_v" ADD CONSTRAINT "_experience_v_parent_id_experience_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experience"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experience_v" ADD CONSTRAINT "_experience_v_version_organisation_id_organisations_id_fk" FOREIGN KEY ("version_organisation_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education" ADD CONSTRAINT "education_institution_id_organisations_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_education_v" ADD CONSTRAINT "_education_v_parent_id_education_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."education"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_education_v" ADD CONSTRAINT "_education_v_version_institution_id_organisations_id_fk" FOREIGN KEY ("version_institution_id") REFERENCES "public"."organisations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certifications_v" ADD CONSTRAINT "_certifications_v_parent_id_certifications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."certifications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "expertise" ADD CONSTRAINT "expertise_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "expertise_rels" ADD CONSTRAINT "expertise_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertise_rels" ADD CONSTRAINT "expertise_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_expertise_v" ADD CONSTRAINT "_expertise_v_parent_id_expertise_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."expertise"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_expertise_v" ADD CONSTRAINT "_expertise_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_expertise_v_rels" ADD CONSTRAINT "_expertise_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_expertise_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_expertise_v_rels" ADD CONSTRAINT "_expertise_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "platforms_rels" ADD CONSTRAINT "platforms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "platforms_rels" ADD CONSTRAINT "platforms_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_platforms_v" ADD CONSTRAINT "_platforms_v_parent_id_platforms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."platforms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_platforms_v_rels" ADD CONSTRAINT "_platforms_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_platforms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_platforms_v_rels" ADD CONSTRAINT "_platforms_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "metrics" ADD CONSTRAINT "metrics_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_metrics_v" ADD CONSTRAINT "_metrics_v_parent_id_metrics_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."metrics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_metrics_v" ADD CONSTRAINT "_metrics_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_taxonomy_terms_fk" FOREIGN KEY ("taxonomy_terms_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_taxonomy_terms_fk" FOREIGN KEY ("taxonomy_terms_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_parent_id_authors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lab_assets_channels" ADD CONSTRAINT "lab_assets_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lab_assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lab_assets_rels" ADD CONSTRAINT "lab_assets_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lab_assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lab_assets_rels" ADD CONSTRAINT "lab_assets_rels_taxonomy_terms_fk" FOREIGN KEY ("taxonomy_terms_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lab_assets_v_version_channels" ADD CONSTRAINT "_lab_assets_v_version_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lab_assets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lab_assets_v" ADD CONSTRAINT "_lab_assets_v_parent_id_lab_assets_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lab_assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lab_assets_v_rels" ADD CONSTRAINT "_lab_assets_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_lab_assets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lab_assets_v_rels" ADD CONSTRAINT "_lab_assets_v_rels_taxonomy_terms_fk" FOREIGN KEY ("taxonomy_terms_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "taxonomy_terms_synonyms" ADD CONSTRAINT "taxonomy_terms_synonyms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "taxonomy_terms" ADD CONSTRAINT "taxonomy_terms_parent_id_taxonomy_terms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "taxonomy_terms_rels" ADD CONSTRAINT "taxonomy_terms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "taxonomy_terms_rels" ADD CONSTRAINT "taxonomy_terms_rels_taxonomy_terms_fk" FOREIGN KEY ("taxonomy_terms_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_taxonomy_terms_v_version_synonyms" ADD CONSTRAINT "_taxonomy_terms_v_version_synonyms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_taxonomy_terms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_taxonomy_terms_v" ADD CONSTRAINT "_taxonomy_terms_v_parent_id_taxonomy_terms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_taxonomy_terms_v" ADD CONSTRAINT "_taxonomy_terms_v_version_parent_id_taxonomy_terms_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_taxonomy_terms_v_rels" ADD CONSTRAINT "_taxonomy_terms_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_taxonomy_terms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_taxonomy_terms_v_rels" ADD CONSTRAINT "_taxonomy_terms_v_rels_taxonomy_terms_fk" FOREIGN KEY ("taxonomy_terms_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lab_workflows_stages_requirements" ADD CONSTRAINT "lab_workflows_stages_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lab_workflows_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lab_workflows_stages_transitions" ADD CONSTRAINT "lab_workflows_stages_transitions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lab_workflows_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lab_workflows_stages" ADD CONSTRAINT "lab_workflows_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lab_workflows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lab_workflows_v_version_stages_requirements" ADD CONSTRAINT "_lab_workflows_v_version_stages_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lab_workflows_v_version_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lab_workflows_v_version_stages_transitions" ADD CONSTRAINT "_lab_workflows_v_version_stages_transitions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lab_workflows_v_version_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lab_workflows_v_version_stages" ADD CONSTRAINT "_lab_workflows_v_version_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lab_workflows_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lab_workflows_v" ADD CONSTRAINT "_lab_workflows_v_parent_id_lab_workflows_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lab_workflows"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organisations_fk" FOREIGN KEY ("organisations_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experience_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_fk" FOREIGN KEY ("education_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_platforms_fk" FOREIGN KEY ("platforms_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_metrics_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lab_assets_fk" FOREIGN KEY ("lab_assets_id") REFERENCES "public"."lab_assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_taxonomy_terms_fk" FOREIGN KEY ("taxonomy_terms_id") REFERENCES "public"."taxonomy_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lab_workflows_fk" FOREIGN KEY ("lab_workflows_id") REFERENCES "public"."lab_workflows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero" ADD CONSTRAINT "homepage_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_impact" ADD CONSTRAINT "homepage_blocks_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_featured" ADD CONSTRAINT "homepage_blocks_featured_projects_id_projects_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_featured" ADD CONSTRAINT "homepage_blocks_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_projects" ADD CONSTRAINT "homepage_blocks_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_expertise" ADD CONSTRAINT "homepage_blocks_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_lab" ADD CONSTRAINT "homepage_blocks_lab_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_platforms" ADD CONSTRAINT "homepage_blocks_platforms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_insights" ADD CONSTRAINT "homepage_blocks_insights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_career" ADD CONSTRAINT "homepage_blocks_career_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_education" ADD CONSTRAINT "homepage_blocks_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_about" ADD CONSTRAINT "homepage_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_contact" ADD CONSTRAINT "homepage_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_metrics_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero" ADD CONSTRAINT "_homepage_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_impact" ADD CONSTRAINT "_homepage_v_blocks_impact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_featured" ADD CONSTRAINT "_homepage_v_blocks_featured_projects_id_projects_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_featured" ADD CONSTRAINT "_homepage_v_blocks_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_projects" ADD CONSTRAINT "_homepage_v_blocks_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_expertise" ADD CONSTRAINT "_homepage_v_blocks_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_lab" ADD CONSTRAINT "_homepage_v_blocks_lab_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_platforms" ADD CONSTRAINT "_homepage_v_blocks_platforms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_insights" ADD CONSTRAINT "_homepage_v_blocks_insights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_career" ADD CONSTRAINT "_homepage_v_blocks_career_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_education" ADD CONSTRAINT "_homepage_v_blocks_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_about" ADD CONSTRAINT "_homepage_v_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_contact" ADD CONSTRAINT "_homepage_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_metrics_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_links" ADD CONSTRAINT "header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links" ADD CONSTRAINT "footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_settings" ADD CONSTRAINT "seo_settings_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "projects_methodology_order_idx" ON "projects_methodology" USING btree ("_order");
  CREATE INDEX "projects_methodology_parent_id_idx" ON "projects_methodology" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_organisation_idx" ON "projects" USING btree ("organisation_id");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects" USING btree ("meta_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_categories_id_idx" ON "projects_rels" USING btree ("categories_id");
  CREATE INDEX "projects_rels_tags_id_idx" ON "projects_rels" USING btree ("tags_id");
  CREATE INDEX "projects_rels_platforms_id_idx" ON "projects_rels" USING btree ("platforms_id");
  CREATE INDEX "projects_rels_metrics_id_idx" ON "projects_rels" USING btree ("metrics_id");
  CREATE INDEX "projects_rels_projects_id_idx" ON "projects_rels" USING btree ("projects_id");
  CREATE INDEX "_projects_v_version_methodology_order_idx" ON "_projects_v_version_methodology" USING btree ("_order");
  CREATE INDEX "_projects_v_version_methodology_parent_id_idx" ON "_projects_v_version_methodology" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_organisation_idx" ON "_projects_v" USING btree ("version_organisation_id");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_categories_id_idx" ON "_projects_v_rels" USING btree ("categories_id");
  CREATE INDEX "_projects_v_rels_tags_id_idx" ON "_projects_v_rels" USING btree ("tags_id");
  CREATE INDEX "_projects_v_rels_platforms_id_idx" ON "_projects_v_rels" USING btree ("platforms_id");
  CREATE INDEX "_projects_v_rels_metrics_id_idx" ON "_projects_v_rels" USING btree ("metrics_id");
  CREATE INDEX "_projects_v_rels_projects_id_idx" ON "_projects_v_rels" USING btree ("projects_id");
  CREATE INDEX "posts_references_order_idx" ON "posts_references" USING btree ("_order");
  CREATE INDEX "posts_references_parent_id_idx" ON "posts_references" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_references_order_idx" ON "_posts_v_version_references" USING btree ("_order");
  CREATE INDEX "_posts_v_version_references_parent_id_idx" ON "_posts_v_version_references" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "media_category_idx" ON "media" USING btree ("category_id");
  CREATE INDEX "media_uploader_idx" ON "media" USING btree ("uploader_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE INDEX "media_rels_taxonomy_terms_id_idx" ON "media_rels" USING btree ("taxonomy_terms_id");
  CREATE UNIQUE INDEX "organisations_slug_idx" ON "organisations" USING btree ("slug");
  CREATE INDEX "organisations_logo_idx" ON "organisations" USING btree ("logo_id");
  CREATE INDEX "organisations_updated_at_idx" ON "organisations" USING btree ("updated_at");
  CREATE INDEX "organisations_created_at_idx" ON "organisations" USING btree ("created_at");
  CREATE INDEX "organisations__status_idx" ON "organisations" USING btree ("_status");
  CREATE INDEX "_organisations_v_parent_idx" ON "_organisations_v" USING btree ("parent_id");
  CREATE INDEX "_organisations_v_version_version_slug_idx" ON "_organisations_v" USING btree ("version_slug");
  CREATE INDEX "_organisations_v_version_version_logo_idx" ON "_organisations_v" USING btree ("version_logo_id");
  CREATE INDEX "_organisations_v_version_version_updated_at_idx" ON "_organisations_v" USING btree ("version_updated_at");
  CREATE INDEX "_organisations_v_version_version_created_at_idx" ON "_organisations_v" USING btree ("version_created_at");
  CREATE INDEX "_organisations_v_version_version__status_idx" ON "_organisations_v" USING btree ("version__status");
  CREATE INDEX "_organisations_v_created_at_idx" ON "_organisations_v" USING btree ("created_at");
  CREATE INDEX "_organisations_v_updated_at_idx" ON "_organisations_v" USING btree ("updated_at");
  CREATE INDEX "_organisations_v_latest_idx" ON "_organisations_v" USING btree ("latest");
  CREATE INDEX "experience_responsibilities_order_idx" ON "experience_responsibilities" USING btree ("_order");
  CREATE INDEX "experience_responsibilities_parent_id_idx" ON "experience_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "experience_organisation_idx" ON "experience" USING btree ("organisation_id");
  CREATE INDEX "experience_updated_at_idx" ON "experience" USING btree ("updated_at");
  CREATE INDEX "experience_created_at_idx" ON "experience" USING btree ("created_at");
  CREATE INDEX "experience__status_idx" ON "experience" USING btree ("_status");
  CREATE INDEX "_experience_v_version_responsibilities_order_idx" ON "_experience_v_version_responsibilities" USING btree ("_order");
  CREATE INDEX "_experience_v_version_responsibilities_parent_id_idx" ON "_experience_v_version_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "_experience_v_parent_idx" ON "_experience_v" USING btree ("parent_id");
  CREATE INDEX "_experience_v_version_version_organisation_idx" ON "_experience_v" USING btree ("version_organisation_id");
  CREATE INDEX "_experience_v_version_version_updated_at_idx" ON "_experience_v" USING btree ("version_updated_at");
  CREATE INDEX "_experience_v_version_version_created_at_idx" ON "_experience_v" USING btree ("version_created_at");
  CREATE INDEX "_experience_v_version_version__status_idx" ON "_experience_v" USING btree ("version__status");
  CREATE INDEX "_experience_v_created_at_idx" ON "_experience_v" USING btree ("created_at");
  CREATE INDEX "_experience_v_updated_at_idx" ON "_experience_v" USING btree ("updated_at");
  CREATE INDEX "_experience_v_latest_idx" ON "_experience_v" USING btree ("latest");
  CREATE INDEX "education_institution_idx" ON "education" USING btree ("institution_id");
  CREATE INDEX "education_updated_at_idx" ON "education" USING btree ("updated_at");
  CREATE INDEX "education_created_at_idx" ON "education" USING btree ("created_at");
  CREATE INDEX "education__status_idx" ON "education" USING btree ("_status");
  CREATE INDEX "_education_v_parent_idx" ON "_education_v" USING btree ("parent_id");
  CREATE INDEX "_education_v_version_version_institution_idx" ON "_education_v" USING btree ("version_institution_id");
  CREATE INDEX "_education_v_version_version_updated_at_idx" ON "_education_v" USING btree ("version_updated_at");
  CREATE INDEX "_education_v_version_version_created_at_idx" ON "_education_v" USING btree ("version_created_at");
  CREATE INDEX "_education_v_version_version__status_idx" ON "_education_v" USING btree ("version__status");
  CREATE INDEX "_education_v_created_at_idx" ON "_education_v" USING btree ("created_at");
  CREATE INDEX "_education_v_updated_at_idx" ON "_education_v" USING btree ("updated_at");
  CREATE INDEX "_education_v_latest_idx" ON "_education_v" USING btree ("latest");
  CREATE INDEX "certifications_updated_at_idx" ON "certifications" USING btree ("updated_at");
  CREATE INDEX "certifications_created_at_idx" ON "certifications" USING btree ("created_at");
  CREATE INDEX "certifications__status_idx" ON "certifications" USING btree ("_status");
  CREATE INDEX "_certifications_v_parent_idx" ON "_certifications_v" USING btree ("parent_id");
  CREATE INDEX "_certifications_v_version_version_updated_at_idx" ON "_certifications_v" USING btree ("version_updated_at");
  CREATE INDEX "_certifications_v_version_version_created_at_idx" ON "_certifications_v" USING btree ("version_created_at");
  CREATE INDEX "_certifications_v_version_version__status_idx" ON "_certifications_v" USING btree ("version__status");
  CREATE INDEX "_certifications_v_created_at_idx" ON "_certifications_v" USING btree ("created_at");
  CREATE INDEX "_certifications_v_updated_at_idx" ON "_certifications_v" USING btree ("updated_at");
  CREATE INDEX "_certifications_v_latest_idx" ON "_certifications_v" USING btree ("latest");
  CREATE INDEX "expertise_category_idx" ON "expertise" USING btree ("category_id");
  CREATE INDEX "expertise_updated_at_idx" ON "expertise" USING btree ("updated_at");
  CREATE INDEX "expertise_created_at_idx" ON "expertise" USING btree ("created_at");
  CREATE INDEX "expertise__status_idx" ON "expertise" USING btree ("_status");
  CREATE INDEX "expertise_rels_order_idx" ON "expertise_rels" USING btree ("order");
  CREATE INDEX "expertise_rels_parent_idx" ON "expertise_rels" USING btree ("parent_id");
  CREATE INDEX "expertise_rels_path_idx" ON "expertise_rels" USING btree ("path");
  CREATE INDEX "expertise_rels_projects_id_idx" ON "expertise_rels" USING btree ("projects_id");
  CREATE INDEX "_expertise_v_parent_idx" ON "_expertise_v" USING btree ("parent_id");
  CREATE INDEX "_expertise_v_version_version_category_idx" ON "_expertise_v" USING btree ("version_category_id");
  CREATE INDEX "_expertise_v_version_version_updated_at_idx" ON "_expertise_v" USING btree ("version_updated_at");
  CREATE INDEX "_expertise_v_version_version_created_at_idx" ON "_expertise_v" USING btree ("version_created_at");
  CREATE INDEX "_expertise_v_version_version__status_idx" ON "_expertise_v" USING btree ("version__status");
  CREATE INDEX "_expertise_v_created_at_idx" ON "_expertise_v" USING btree ("created_at");
  CREATE INDEX "_expertise_v_updated_at_idx" ON "_expertise_v" USING btree ("updated_at");
  CREATE INDEX "_expertise_v_latest_idx" ON "_expertise_v" USING btree ("latest");
  CREATE INDEX "_expertise_v_rels_order_idx" ON "_expertise_v_rels" USING btree ("order");
  CREATE INDEX "_expertise_v_rels_parent_idx" ON "_expertise_v_rels" USING btree ("parent_id");
  CREATE INDEX "_expertise_v_rels_path_idx" ON "_expertise_v_rels" USING btree ("path");
  CREATE INDEX "_expertise_v_rels_projects_id_idx" ON "_expertise_v_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "platforms_slug_idx" ON "platforms" USING btree ("slug");
  CREATE INDEX "platforms_updated_at_idx" ON "platforms" USING btree ("updated_at");
  CREATE INDEX "platforms_created_at_idx" ON "platforms" USING btree ("created_at");
  CREATE INDEX "platforms__status_idx" ON "platforms" USING btree ("_status");
  CREATE INDEX "platforms_rels_order_idx" ON "platforms_rels" USING btree ("order");
  CREATE INDEX "platforms_rels_parent_idx" ON "platforms_rels" USING btree ("parent_id");
  CREATE INDEX "platforms_rels_path_idx" ON "platforms_rels" USING btree ("path");
  CREATE INDEX "platforms_rels_projects_id_idx" ON "platforms_rels" USING btree ("projects_id");
  CREATE INDEX "_platforms_v_parent_idx" ON "_platforms_v" USING btree ("parent_id");
  CREATE INDEX "_platforms_v_version_version_slug_idx" ON "_platforms_v" USING btree ("version_slug");
  CREATE INDEX "_platforms_v_version_version_updated_at_idx" ON "_platforms_v" USING btree ("version_updated_at");
  CREATE INDEX "_platforms_v_version_version_created_at_idx" ON "_platforms_v" USING btree ("version_created_at");
  CREATE INDEX "_platforms_v_version_version__status_idx" ON "_platforms_v" USING btree ("version__status");
  CREATE INDEX "_platforms_v_created_at_idx" ON "_platforms_v" USING btree ("created_at");
  CREATE INDEX "_platforms_v_updated_at_idx" ON "_platforms_v" USING btree ("updated_at");
  CREATE INDEX "_platforms_v_latest_idx" ON "_platforms_v" USING btree ("latest");
  CREATE INDEX "_platforms_v_rels_order_idx" ON "_platforms_v_rels" USING btree ("order");
  CREATE INDEX "_platforms_v_rels_parent_idx" ON "_platforms_v_rels" USING btree ("parent_id");
  CREATE INDEX "_platforms_v_rels_path_idx" ON "_platforms_v_rels" USING btree ("path");
  CREATE INDEX "_platforms_v_rels_projects_id_idx" ON "_platforms_v_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "metrics_slug_idx" ON "metrics" USING btree ("slug");
  CREATE INDEX "metrics_project_idx" ON "metrics" USING btree ("project_id");
  CREATE INDEX "metrics_updated_at_idx" ON "metrics" USING btree ("updated_at");
  CREATE INDEX "metrics_created_at_idx" ON "metrics" USING btree ("created_at");
  CREATE INDEX "metrics__status_idx" ON "metrics" USING btree ("_status");
  CREATE INDEX "_metrics_v_parent_idx" ON "_metrics_v" USING btree ("parent_id");
  CREATE INDEX "_metrics_v_version_version_slug_idx" ON "_metrics_v" USING btree ("version_slug");
  CREATE INDEX "_metrics_v_version_version_project_idx" ON "_metrics_v" USING btree ("version_project_id");
  CREATE INDEX "_metrics_v_version_version_updated_at_idx" ON "_metrics_v" USING btree ("version_updated_at");
  CREATE INDEX "_metrics_v_version_version_created_at_idx" ON "_metrics_v" USING btree ("version_created_at");
  CREATE INDEX "_metrics_v_version_version__status_idx" ON "_metrics_v" USING btree ("version__status");
  CREATE INDEX "_metrics_v_created_at_idx" ON "_metrics_v" USING btree ("created_at");
  CREATE INDEX "_metrics_v_updated_at_idx" ON "_metrics_v" USING btree ("updated_at");
  CREATE INDEX "_metrics_v_latest_idx" ON "_metrics_v" USING btree ("latest");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories__status_idx" ON "categories" USING btree ("_status");
  CREATE INDEX "_categories_v_parent_idx" ON "_categories_v" USING btree ("parent_id");
  CREATE INDEX "_categories_v_version_version_slug_idx" ON "_categories_v" USING btree ("version_slug");
  CREATE INDEX "_categories_v_version_version_updated_at_idx" ON "_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_categories_v_version_version_created_at_idx" ON "_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_categories_v_version_version__status_idx" ON "_categories_v" USING btree ("version__status");
  CREATE INDEX "_categories_v_created_at_idx" ON "_categories_v" USING btree ("created_at");
  CREATE INDEX "_categories_v_updated_at_idx" ON "_categories_v" USING btree ("updated_at");
  CREATE INDEX "_categories_v_latest_idx" ON "_categories_v" USING btree ("latest");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags__status_idx" ON "tags" USING btree ("_status");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_taxonomy_terms_id_idx" ON "tags_rels" USING btree ("taxonomy_terms_id");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version_slug_idx" ON "_tags_v" USING btree ("version_slug");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_version_version__status_idx" ON "_tags_v" USING btree ("version__status");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_latest_idx" ON "_tags_v" USING btree ("latest");
  CREATE INDEX "_tags_v_rels_order_idx" ON "_tags_v_rels" USING btree ("order");
  CREATE INDEX "_tags_v_rels_parent_idx" ON "_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tags_v_rels_path_idx" ON "_tags_v_rels" USING btree ("path");
  CREATE INDEX "_tags_v_rels_taxonomy_terms_id_idx" ON "_tags_v_rels" USING btree ("taxonomy_terms_id");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_portrait_idx" ON "authors" USING btree ("portrait_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE INDEX "authors__status_idx" ON "authors" USING btree ("_status");
  CREATE INDEX "_authors_v_parent_idx" ON "_authors_v" USING btree ("parent_id");
  CREATE INDEX "_authors_v_version_version_slug_idx" ON "_authors_v" USING btree ("version_slug");
  CREATE INDEX "_authors_v_version_version_portrait_idx" ON "_authors_v" USING btree ("version_portrait_id");
  CREATE INDEX "_authors_v_version_version_updated_at_idx" ON "_authors_v" USING btree ("version_updated_at");
  CREATE INDEX "_authors_v_version_version_created_at_idx" ON "_authors_v" USING btree ("version_created_at");
  CREATE INDEX "_authors_v_version_version__status_idx" ON "_authors_v" USING btree ("version__status");
  CREATE INDEX "_authors_v_created_at_idx" ON "_authors_v" USING btree ("created_at");
  CREATE INDEX "_authors_v_updated_at_idx" ON "_authors_v" USING btree ("updated_at");
  CREATE INDEX "_authors_v_latest_idx" ON "_authors_v" USING btree ("latest");
  CREATE INDEX "lab_assets_channels_order_idx" ON "lab_assets_channels" USING btree ("_order");
  CREATE INDEX "lab_assets_channels_parent_id_idx" ON "lab_assets_channels" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "lab_assets_slug_idx" ON "lab_assets" USING btree ("slug");
  CREATE INDEX "lab_assets_updated_at_idx" ON "lab_assets" USING btree ("updated_at");
  CREATE INDEX "lab_assets_created_at_idx" ON "lab_assets" USING btree ("created_at");
  CREATE INDEX "lab_assets__status_idx" ON "lab_assets" USING btree ("_status");
  CREATE INDEX "lab_assets_rels_order_idx" ON "lab_assets_rels" USING btree ("order");
  CREATE INDEX "lab_assets_rels_parent_idx" ON "lab_assets_rels" USING btree ("parent_id");
  CREATE INDEX "lab_assets_rels_path_idx" ON "lab_assets_rels" USING btree ("path");
  CREATE INDEX "lab_assets_rels_taxonomy_terms_id_idx" ON "lab_assets_rels" USING btree ("taxonomy_terms_id");
  CREATE INDEX "_lab_assets_v_version_channels_order_idx" ON "_lab_assets_v_version_channels" USING btree ("_order");
  CREATE INDEX "_lab_assets_v_version_channels_parent_id_idx" ON "_lab_assets_v_version_channels" USING btree ("_parent_id");
  CREATE INDEX "_lab_assets_v_parent_idx" ON "_lab_assets_v" USING btree ("parent_id");
  CREATE INDEX "_lab_assets_v_version_version_slug_idx" ON "_lab_assets_v" USING btree ("version_slug");
  CREATE INDEX "_lab_assets_v_version_version_updated_at_idx" ON "_lab_assets_v" USING btree ("version_updated_at");
  CREATE INDEX "_lab_assets_v_version_version_created_at_idx" ON "_lab_assets_v" USING btree ("version_created_at");
  CREATE INDEX "_lab_assets_v_version_version__status_idx" ON "_lab_assets_v" USING btree ("version__status");
  CREATE INDEX "_lab_assets_v_created_at_idx" ON "_lab_assets_v" USING btree ("created_at");
  CREATE INDEX "_lab_assets_v_updated_at_idx" ON "_lab_assets_v" USING btree ("updated_at");
  CREATE INDEX "_lab_assets_v_latest_idx" ON "_lab_assets_v" USING btree ("latest");
  CREATE INDEX "_lab_assets_v_rels_order_idx" ON "_lab_assets_v_rels" USING btree ("order");
  CREATE INDEX "_lab_assets_v_rels_parent_idx" ON "_lab_assets_v_rels" USING btree ("parent_id");
  CREATE INDEX "_lab_assets_v_rels_path_idx" ON "_lab_assets_v_rels" USING btree ("path");
  CREATE INDEX "_lab_assets_v_rels_taxonomy_terms_id_idx" ON "_lab_assets_v_rels" USING btree ("taxonomy_terms_id");
  CREATE INDEX "taxonomy_terms_synonyms_order_idx" ON "taxonomy_terms_synonyms" USING btree ("_order");
  CREATE INDEX "taxonomy_terms_synonyms_parent_id_idx" ON "taxonomy_terms_synonyms" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "taxonomy_terms_slug_idx" ON "taxonomy_terms" USING btree ("slug");
  CREATE INDEX "taxonomy_terms_parent_idx" ON "taxonomy_terms" USING btree ("parent_id");
  CREATE INDEX "taxonomy_terms_updated_at_idx" ON "taxonomy_terms" USING btree ("updated_at");
  CREATE INDEX "taxonomy_terms_created_at_idx" ON "taxonomy_terms" USING btree ("created_at");
  CREATE INDEX "taxonomy_terms__status_idx" ON "taxonomy_terms" USING btree ("_status");
  CREATE INDEX "taxonomy_terms_rels_order_idx" ON "taxonomy_terms_rels" USING btree ("order");
  CREATE INDEX "taxonomy_terms_rels_parent_idx" ON "taxonomy_terms_rels" USING btree ("parent_id");
  CREATE INDEX "taxonomy_terms_rels_path_idx" ON "taxonomy_terms_rels" USING btree ("path");
  CREATE INDEX "taxonomy_terms_rels_taxonomy_terms_id_idx" ON "taxonomy_terms_rels" USING btree ("taxonomy_terms_id");
  CREATE INDEX "_taxonomy_terms_v_version_synonyms_order_idx" ON "_taxonomy_terms_v_version_synonyms" USING btree ("_order");
  CREATE INDEX "_taxonomy_terms_v_version_synonyms_parent_id_idx" ON "_taxonomy_terms_v_version_synonyms" USING btree ("_parent_id");
  CREATE INDEX "_taxonomy_terms_v_parent_idx" ON "_taxonomy_terms_v" USING btree ("parent_id");
  CREATE INDEX "_taxonomy_terms_v_version_version_slug_idx" ON "_taxonomy_terms_v" USING btree ("version_slug");
  CREATE INDEX "_taxonomy_terms_v_version_version_parent_idx" ON "_taxonomy_terms_v" USING btree ("version_parent_id");
  CREATE INDEX "_taxonomy_terms_v_version_version_updated_at_idx" ON "_taxonomy_terms_v" USING btree ("version_updated_at");
  CREATE INDEX "_taxonomy_terms_v_version_version_created_at_idx" ON "_taxonomy_terms_v" USING btree ("version_created_at");
  CREATE INDEX "_taxonomy_terms_v_version_version__status_idx" ON "_taxonomy_terms_v" USING btree ("version__status");
  CREATE INDEX "_taxonomy_terms_v_created_at_idx" ON "_taxonomy_terms_v" USING btree ("created_at");
  CREATE INDEX "_taxonomy_terms_v_updated_at_idx" ON "_taxonomy_terms_v" USING btree ("updated_at");
  CREATE INDEX "_taxonomy_terms_v_latest_idx" ON "_taxonomy_terms_v" USING btree ("latest");
  CREATE INDEX "_taxonomy_terms_v_rels_order_idx" ON "_taxonomy_terms_v_rels" USING btree ("order");
  CREATE INDEX "_taxonomy_terms_v_rels_parent_idx" ON "_taxonomy_terms_v_rels" USING btree ("parent_id");
  CREATE INDEX "_taxonomy_terms_v_rels_path_idx" ON "_taxonomy_terms_v_rels" USING btree ("path");
  CREATE INDEX "_taxonomy_terms_v_rels_taxonomy_terms_id_idx" ON "_taxonomy_terms_v_rels" USING btree ("taxonomy_terms_id");
  CREATE INDEX "lab_workflows_stages_requirements_order_idx" ON "lab_workflows_stages_requirements" USING btree ("_order");
  CREATE INDEX "lab_workflows_stages_requirements_parent_id_idx" ON "lab_workflows_stages_requirements" USING btree ("_parent_id");
  CREATE INDEX "lab_workflows_stages_transitions_order_idx" ON "lab_workflows_stages_transitions" USING btree ("_order");
  CREATE INDEX "lab_workflows_stages_transitions_parent_id_idx" ON "lab_workflows_stages_transitions" USING btree ("_parent_id");
  CREATE INDEX "lab_workflows_stages_order_idx" ON "lab_workflows_stages" USING btree ("_order");
  CREATE INDEX "lab_workflows_stages_parent_id_idx" ON "lab_workflows_stages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "lab_workflows_slug_idx" ON "lab_workflows" USING btree ("slug");
  CREATE INDEX "lab_workflows_updated_at_idx" ON "lab_workflows" USING btree ("updated_at");
  CREATE INDEX "lab_workflows_created_at_idx" ON "lab_workflows" USING btree ("created_at");
  CREATE INDEX "lab_workflows__status_idx" ON "lab_workflows" USING btree ("_status");
  CREATE INDEX "_lab_workflows_v_version_stages_requirements_order_idx" ON "_lab_workflows_v_version_stages_requirements" USING btree ("_order");
  CREATE INDEX "_lab_workflows_v_version_stages_requirements_parent_id_idx" ON "_lab_workflows_v_version_stages_requirements" USING btree ("_parent_id");
  CREATE INDEX "_lab_workflows_v_version_stages_transitions_order_idx" ON "_lab_workflows_v_version_stages_transitions" USING btree ("_order");
  CREATE INDEX "_lab_workflows_v_version_stages_transitions_parent_id_idx" ON "_lab_workflows_v_version_stages_transitions" USING btree ("_parent_id");
  CREATE INDEX "_lab_workflows_v_version_stages_order_idx" ON "_lab_workflows_v_version_stages" USING btree ("_order");
  CREATE INDEX "_lab_workflows_v_version_stages_parent_id_idx" ON "_lab_workflows_v_version_stages" USING btree ("_parent_id");
  CREATE INDEX "_lab_workflows_v_parent_idx" ON "_lab_workflows_v" USING btree ("parent_id");
  CREATE INDEX "_lab_workflows_v_version_version_slug_idx" ON "_lab_workflows_v" USING btree ("version_slug");
  CREATE INDEX "_lab_workflows_v_version_version_updated_at_idx" ON "_lab_workflows_v" USING btree ("version_updated_at");
  CREATE INDEX "_lab_workflows_v_version_version_created_at_idx" ON "_lab_workflows_v" USING btree ("version_created_at");
  CREATE INDEX "_lab_workflows_v_version_version__status_idx" ON "_lab_workflows_v" USING btree ("version__status");
  CREATE INDEX "_lab_workflows_v_created_at_idx" ON "_lab_workflows_v" USING btree ("created_at");
  CREATE INDEX "_lab_workflows_v_updated_at_idx" ON "_lab_workflows_v" USING btree ("updated_at");
  CREATE INDEX "_lab_workflows_v_latest_idx" ON "_lab_workflows_v" USING btree ("latest");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_projects_id_idx" ON "redirects_rels" USING btree ("projects_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_organisations_id_idx" ON "payload_locked_documents_rels" USING btree ("organisations_id");
  CREATE INDEX "payload_locked_documents_rels_experience_id_idx" ON "payload_locked_documents_rels" USING btree ("experience_id");
  CREATE INDEX "payload_locked_documents_rels_education_id_idx" ON "payload_locked_documents_rels" USING btree ("education_id");
  CREATE INDEX "payload_locked_documents_rels_certifications_id_idx" ON "payload_locked_documents_rels" USING btree ("certifications_id");
  CREATE INDEX "payload_locked_documents_rels_expertise_id_idx" ON "payload_locked_documents_rels" USING btree ("expertise_id");
  CREATE INDEX "payload_locked_documents_rels_platforms_id_idx" ON "payload_locked_documents_rels" USING btree ("platforms_id");
  CREATE INDEX "payload_locked_documents_rels_metrics_id_idx" ON "payload_locked_documents_rels" USING btree ("metrics_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_lab_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("lab_assets_id");
  CREATE INDEX "payload_locked_documents_rels_taxonomy_terms_id_idx" ON "payload_locked_documents_rels" USING btree ("taxonomy_terms_id");
  CREATE INDEX "payload_locked_documents_rels_lab_workflows_id_idx" ON "payload_locked_documents_rels" USING btree ("lab_workflows_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_blocks_hero_order_idx" ON "homepage_blocks_hero" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_parent_id_idx" ON "homepage_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_path_idx" ON "homepage_blocks_hero" USING btree ("_path");
  CREATE INDEX "homepage_blocks_impact_order_idx" ON "homepage_blocks_impact" USING btree ("_order");
  CREATE INDEX "homepage_blocks_impact_parent_id_idx" ON "homepage_blocks_impact" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_impact_path_idx" ON "homepage_blocks_impact" USING btree ("_path");
  CREATE INDEX "homepage_blocks_featured_order_idx" ON "homepage_blocks_featured" USING btree ("_order");
  CREATE INDEX "homepage_blocks_featured_parent_id_idx" ON "homepage_blocks_featured" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_featured_path_idx" ON "homepage_blocks_featured" USING btree ("_path");
  CREATE INDEX "homepage_blocks_featured_projects_idx" ON "homepage_blocks_featured" USING btree ("projects_id");
  CREATE INDEX "homepage_blocks_projects_order_idx" ON "homepage_blocks_projects" USING btree ("_order");
  CREATE INDEX "homepage_blocks_projects_parent_id_idx" ON "homepage_blocks_projects" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_projects_path_idx" ON "homepage_blocks_projects" USING btree ("_path");
  CREATE INDEX "homepage_blocks_expertise_order_idx" ON "homepage_blocks_expertise" USING btree ("_order");
  CREATE INDEX "homepage_blocks_expertise_parent_id_idx" ON "homepage_blocks_expertise" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_expertise_path_idx" ON "homepage_blocks_expertise" USING btree ("_path");
  CREATE INDEX "homepage_blocks_lab_order_idx" ON "homepage_blocks_lab" USING btree ("_order");
  CREATE INDEX "homepage_blocks_lab_parent_id_idx" ON "homepage_blocks_lab" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_lab_path_idx" ON "homepage_blocks_lab" USING btree ("_path");
  CREATE INDEX "homepage_blocks_platforms_order_idx" ON "homepage_blocks_platforms" USING btree ("_order");
  CREATE INDEX "homepage_blocks_platforms_parent_id_idx" ON "homepage_blocks_platforms" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_platforms_path_idx" ON "homepage_blocks_platforms" USING btree ("_path");
  CREATE INDEX "homepage_blocks_insights_order_idx" ON "homepage_blocks_insights" USING btree ("_order");
  CREATE INDEX "homepage_blocks_insights_parent_id_idx" ON "homepage_blocks_insights" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_insights_path_idx" ON "homepage_blocks_insights" USING btree ("_path");
  CREATE INDEX "homepage_blocks_career_order_idx" ON "homepage_blocks_career" USING btree ("_order");
  CREATE INDEX "homepage_blocks_career_parent_id_idx" ON "homepage_blocks_career" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_career_path_idx" ON "homepage_blocks_career" USING btree ("_path");
  CREATE INDEX "homepage_blocks_education_order_idx" ON "homepage_blocks_education" USING btree ("_order");
  CREATE INDEX "homepage_blocks_education_parent_id_idx" ON "homepage_blocks_education" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_education_path_idx" ON "homepage_blocks_education" USING btree ("_path");
  CREATE INDEX "homepage_blocks_about_order_idx" ON "homepage_blocks_about" USING btree ("_order");
  CREATE INDEX "homepage_blocks_about_parent_id_idx" ON "homepage_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_about_path_idx" ON "homepage_blocks_about" USING btree ("_path");
  CREATE INDEX "homepage_blocks_contact_order_idx" ON "homepage_blocks_contact" USING btree ("_order");
  CREATE INDEX "homepage_blocks_contact_parent_id_idx" ON "homepage_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_contact_path_idx" ON "homepage_blocks_contact" USING btree ("_path");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_metrics_id_idx" ON "homepage_rels" USING btree ("metrics_id");
  CREATE INDEX "homepage_rels_projects_id_idx" ON "homepage_rels" USING btree ("projects_id");
  CREATE INDEX "homepage_rels_expertise_id_idx" ON "homepage_rels" USING btree ("expertise_id");
  CREATE INDEX "homepage_rels_posts_id_idx" ON "homepage_rels" USING btree ("posts_id");
  CREATE INDEX "_homepage_v_blocks_hero_order_idx" ON "_homepage_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_hero_parent_id_idx" ON "_homepage_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_hero_path_idx" ON "_homepage_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_impact_order_idx" ON "_homepage_v_blocks_impact" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_impact_parent_id_idx" ON "_homepage_v_blocks_impact" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_impact_path_idx" ON "_homepage_v_blocks_impact" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_featured_order_idx" ON "_homepage_v_blocks_featured" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_featured_parent_id_idx" ON "_homepage_v_blocks_featured" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_featured_path_idx" ON "_homepage_v_blocks_featured" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_featured_projects_idx" ON "_homepage_v_blocks_featured" USING btree ("projects_id");
  CREATE INDEX "_homepage_v_blocks_projects_order_idx" ON "_homepage_v_blocks_projects" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_projects_parent_id_idx" ON "_homepage_v_blocks_projects" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_projects_path_idx" ON "_homepage_v_blocks_projects" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_expertise_order_idx" ON "_homepage_v_blocks_expertise" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_expertise_parent_id_idx" ON "_homepage_v_blocks_expertise" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_expertise_path_idx" ON "_homepage_v_blocks_expertise" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_lab_order_idx" ON "_homepage_v_blocks_lab" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_lab_parent_id_idx" ON "_homepage_v_blocks_lab" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_lab_path_idx" ON "_homepage_v_blocks_lab" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_platforms_order_idx" ON "_homepage_v_blocks_platforms" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_platforms_parent_id_idx" ON "_homepage_v_blocks_platforms" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_platforms_path_idx" ON "_homepage_v_blocks_platforms" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_insights_order_idx" ON "_homepage_v_blocks_insights" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_insights_parent_id_idx" ON "_homepage_v_blocks_insights" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_insights_path_idx" ON "_homepage_v_blocks_insights" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_career_order_idx" ON "_homepage_v_blocks_career" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_career_parent_id_idx" ON "_homepage_v_blocks_career" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_career_path_idx" ON "_homepage_v_blocks_career" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_education_order_idx" ON "_homepage_v_blocks_education" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_education_parent_id_idx" ON "_homepage_v_blocks_education" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_education_path_idx" ON "_homepage_v_blocks_education" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_about_order_idx" ON "_homepage_v_blocks_about" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_about_parent_id_idx" ON "_homepage_v_blocks_about" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_about_path_idx" ON "_homepage_v_blocks_about" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_contact_order_idx" ON "_homepage_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_contact_parent_id_idx" ON "_homepage_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_contact_path_idx" ON "_homepage_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_metrics_id_idx" ON "_homepage_v_rels" USING btree ("metrics_id");
  CREATE INDEX "_homepage_v_rels_projects_id_idx" ON "_homepage_v_rels" USING btree ("projects_id");
  CREATE INDEX "_homepage_v_rels_expertise_id_idx" ON "_homepage_v_rels" USING btree ("expertise_id");
  CREATE INDEX "_homepage_v_rels_posts_id_idx" ON "_homepage_v_rels" USING btree ("posts_id");
  CREATE INDEX "profile_portrait_idx" ON "profile" USING btree ("portrait_id");
  CREATE INDEX "profile_cv_idx" ON "profile" USING btree ("cv_id");
  CREATE INDEX "header_links_order_idx" ON "header_links" USING btree ("_order");
  CREATE INDEX "header_links_parent_id_idx" ON "header_links" USING btree ("_parent_id");
  CREATE INDEX "footer_links_order_idx" ON "footer_links" USING btree ("_order");
  CREATE INDEX "footer_links_parent_id_idx" ON "footer_links" USING btree ("_parent_id");
  CREATE INDEX "seo_settings_social_image_idx" ON "seo_settings" USING btree ("social_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "projects_methodology" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_methodology" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "posts_references" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_references" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "organisations" CASCADE;
  DROP TABLE "_organisations_v" CASCADE;
  DROP TABLE "experience_responsibilities" CASCADE;
  DROP TABLE "experience" CASCADE;
  DROP TABLE "_experience_v_version_responsibilities" CASCADE;
  DROP TABLE "_experience_v" CASCADE;
  DROP TABLE "education" CASCADE;
  DROP TABLE "_education_v" CASCADE;
  DROP TABLE "certifications" CASCADE;
  DROP TABLE "_certifications_v" CASCADE;
  DROP TABLE "expertise" CASCADE;
  DROP TABLE "expertise_rels" CASCADE;
  DROP TABLE "_expertise_v" CASCADE;
  DROP TABLE "_expertise_v_rels" CASCADE;
  DROP TABLE "platforms" CASCADE;
  DROP TABLE "platforms_rels" CASCADE;
  DROP TABLE "_platforms_v" CASCADE;
  DROP TABLE "_platforms_v_rels" CASCADE;
  DROP TABLE "metrics" CASCADE;
  DROP TABLE "_metrics_v" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "_categories_v" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_tags_v_rels" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "_authors_v" CASCADE;
  DROP TABLE "lab_assets_channels" CASCADE;
  DROP TABLE "lab_assets" CASCADE;
  DROP TABLE "lab_assets_rels" CASCADE;
  DROP TABLE "_lab_assets_v_version_channels" CASCADE;
  DROP TABLE "_lab_assets_v" CASCADE;
  DROP TABLE "_lab_assets_v_rels" CASCADE;
  DROP TABLE "taxonomy_terms_synonyms" CASCADE;
  DROP TABLE "taxonomy_terms" CASCADE;
  DROP TABLE "taxonomy_terms_rels" CASCADE;
  DROP TABLE "_taxonomy_terms_v_version_synonyms" CASCADE;
  DROP TABLE "_taxonomy_terms_v" CASCADE;
  DROP TABLE "_taxonomy_terms_v_rels" CASCADE;
  DROP TABLE "lab_workflows_stages_requirements" CASCADE;
  DROP TABLE "lab_workflows_stages_transitions" CASCADE;
  DROP TABLE "lab_workflows_stages" CASCADE;
  DROP TABLE "lab_workflows" CASCADE;
  DROP TABLE "_lab_workflows_v_version_stages_requirements" CASCADE;
  DROP TABLE "_lab_workflows_v_version_stages_transitions" CASCADE;
  DROP TABLE "_lab_workflows_v_version_stages" CASCADE;
  DROP TABLE "_lab_workflows_v" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_blocks_hero" CASCADE;
  DROP TABLE "homepage_blocks_impact" CASCADE;
  DROP TABLE "homepage_blocks_featured" CASCADE;
  DROP TABLE "homepage_blocks_projects" CASCADE;
  DROP TABLE "homepage_blocks_expertise" CASCADE;
  DROP TABLE "homepage_blocks_lab" CASCADE;
  DROP TABLE "homepage_blocks_platforms" CASCADE;
  DROP TABLE "homepage_blocks_insights" CASCADE;
  DROP TABLE "homepage_blocks_career" CASCADE;
  DROP TABLE "homepage_blocks_education" CASCADE;
  DROP TABLE "homepage_blocks_about" CASCADE;
  DROP TABLE "homepage_blocks_contact" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_blocks_hero" CASCADE;
  DROP TABLE "_homepage_v_blocks_impact" CASCADE;
  DROP TABLE "_homepage_v_blocks_featured" CASCADE;
  DROP TABLE "_homepage_v_blocks_projects" CASCADE;
  DROP TABLE "_homepage_v_blocks_expertise" CASCADE;
  DROP TABLE "_homepage_v_blocks_lab" CASCADE;
  DROP TABLE "_homepage_v_blocks_platforms" CASCADE;
  DROP TABLE "_homepage_v_blocks_insights" CASCADE;
  DROP TABLE "_homepage_v_blocks_career" CASCADE;
  DROP TABLE "_homepage_v_blocks_education" CASCADE;
  DROP TABLE "_homepage_v_blocks_about" CASCADE;
  DROP TABLE "_homepage_v_blocks_contact" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "profile" CASCADE;
  DROP TABLE "header_links" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "seo_settings" CASCADE;
  DROP TABLE "lab_settings" CASCADE;
  DROP TABLE "contact_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_projects_visual";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_visual";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_posts_kind";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_kind";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_media_approval";
  DROP TYPE "public"."enum_media_confidentiality";
  DROP TYPE "public"."enum_media_visibility";
  DROP TYPE "public"."enum_organisations_status";
  DROP TYPE "public"."enum__organisations_v_version_status";
  DROP TYPE "public"."enum_experience_status";
  DROP TYPE "public"."enum__experience_v_version_status";
  DROP TYPE "public"."enum_education_status";
  DROP TYPE "public"."enum__education_v_version_status";
  DROP TYPE "public"."enum_certifications_status";
  DROP TYPE "public"."enum__certifications_v_version_status";
  DROP TYPE "public"."enum_expertise_status";
  DROP TYPE "public"."enum__expertise_v_version_status";
  DROP TYPE "public"."enum_platforms_proficiency";
  DROP TYPE "public"."enum_platforms_status";
  DROP TYPE "public"."enum__platforms_v_version_proficiency";
  DROP TYPE "public"."enum__platforms_v_version_status";
  DROP TYPE "public"."enum_metrics_status";
  DROP TYPE "public"."enum__metrics_v_version_status";
  DROP TYPE "public"."enum_categories_status";
  DROP TYPE "public"."enum__categories_v_version_status";
  DROP TYPE "public"."enum_tags_status";
  DROP TYPE "public"."enum__tags_v_version_status";
  DROP TYPE "public"."enum_authors_status";
  DROP TYPE "public"."enum__authors_v_version_status";
  DROP TYPE "public"."enum_lab_assets_kind";
  DROP TYPE "public"."enum_lab_assets_visual";
  DROP TYPE "public"."enum_lab_assets_state";
  DROP TYPE "public"."enum_lab_assets_status";
  DROP TYPE "public"."enum__lab_assets_v_version_kind";
  DROP TYPE "public"."enum__lab_assets_v_version_visual";
  DROP TYPE "public"."enum__lab_assets_v_version_state";
  DROP TYPE "public"."enum__lab_assets_v_version_status";
  DROP TYPE "public"."enum_taxonomy_terms_status";
  DROP TYPE "public"."enum__taxonomy_terms_v_version_status";
  DROP TYPE "public"."enum_lab_workflows_status";
  DROP TYPE "public"."enum__lab_workflows_v_version_status";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_homepage_blocks_hero_layout";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_blocks_hero_layout";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum_lab_settings_default_view";`)
}
