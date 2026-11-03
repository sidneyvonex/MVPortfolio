-- Hand-edited: existing projects need a slug before the column can be NOT NULL.
ALTER TABLE "projectsTable" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "projectsTable" ADD COLUMN "summary" text;--> statement-breakpoint
-- Slug from the title ("My App 2.0" -> "my-app-2-0"); a repeated title gets "-<projectId>" added.
WITH base AS (
	SELECT "projectId",
		COALESCE(NULLIF(trim(BOTH '-' FROM regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g')), ''), 'project') AS s
	FROM "projectsTable"
), ranked AS (
	SELECT "projectId", s, row_number() OVER (PARTITION BY s ORDER BY "projectId") AS n FROM base
)
UPDATE "projectsTable" p
SET "slug" = CASE WHEN r.n = 1 THEN r.s ELSE r.s || '-' || p."projectId" END
FROM ranked r
WHERE p."projectId" = r."projectId";--> statement-breakpoint
ALTER TABLE "projectsTable" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projectsTable" ADD CONSTRAINT "projectsTable_slug_unique" UNIQUE("slug");
