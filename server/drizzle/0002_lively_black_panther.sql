ALTER TABLE "wines" ADD COLUMN "market" varchar(50) NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "wines" ADD COLUMN "productId" varchar(255) NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "wines" ADD COLUMN "confidence" varchar(10) NOT NULL DEFAULT 'high';--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "market_product_idx" ON "wines" ("market","productId");