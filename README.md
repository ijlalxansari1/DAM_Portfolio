# The Intelligent Archive

A professional portfolio, publishing platform and interactive Digital Asset Management lab for Khalid Ansari. The public site and Payload administration share one Next.js application and PostgreSQL schema.

## Local setup

Use Node.js 24.22.3, pnpm 12.23.0 and a PostgreSQL database. Copy `.env.example` to `.env.local`, set `DATABASE_URL`, and generate a unique `PAYLOAD_SECRET` with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`. The default public URL is `http://localhost:3000`.

```sh
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open the homepage and `/admin`. On an empty local database, Payload guides you through creating the initial administrator. The seed is a one-time import and preserves existing records. Keep separate databases for development, preview and production.

## Publishing

- Projects and Insights have separate draft and published states. Edit, save a draft, then select Preview or Live Preview. Publishing refreshes the detail page, archives, homepage, and sitemap. Unpublishing removes an entry from public queries. Changing a published slug creates a permanent redirect.
- Under **Homepage sections**, reorder sections and toggle their visibility. Keep the hero first and retain the contact section. The featured project and impact metrics reference individual catalogue records.
- Media uploads are private by default. To serve a file publicly, mark it **Approved**, **Public** visibility and **Public** confidentiality, with a valid licence and alternative text where applicable. An expiry date controls ongoing public access. Only assign a CV or portrait under **Professional profile** after it has been approved for publication.
- Enquiries go to **Administration → Enquiries**. Add an approved email address or professional profile link under **Contact settings**. The form stores messages in Payload and currently uses the inbox for review.

## Vercel, Neon and Cloudflare R2

1. Create a Neon PostgreSQL database and configure a scoped connection in `DATABASE_URL`. Before releasing the application, run `pnpm db:migrate`, `pnpm db:seed` and `pnpm admin:bootstrap` against the intended database. For bootstrapping, provide `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` (at least 16 characters) and optionally `INITIAL_ADMIN_NAME` to the local command process.
2. Create a private R2 bucket and restrict its API token to that bucket. Set `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`. Keep public bucket access disabled. Allow the exact administration origin in the bucket CORS policy for `PUT` and the uploader headers `Content-Type` and `If-None-Match`. Large files are uploaded directly to R2, with a 30 MiB application limit. Public media reads pass through Payload access checks.
3. Import the Git repository into Vercel as a Next.js app, select Node.js 24.x, and configure the variables from `.env.example` as environment-specific settings. Set `SITE_URL` to the canonical origin and keep `SITE_INDEXABLE` false on preview deployments. Use the database migration command as an explicit release step. Vercel uses the repository build script.
4. After reviewing the approved public content, enable `SITE_INDEXABLE` in production, set the Google verification value in **SEO defaults**, and submit `/sitemap.xml` in Search Console. Enable Web Analytics and Speed Insights in the Vercel project.

The initial administrator is provisioned before deployment. To offer email-based password recovery, configure a transactional email adapter in Payload and enable the recovery endpoint.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

The Playwright suite uses the seeded catalogue and writes synthetic enquiries and test records. Run it against an isolated database. Pass `TEST_BASE_URL` to use an already running local server. The project's GitHub Actions workflow creates a fresh database for each run.
