-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'SEPAY');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('KING_TEMPLATE');

-- AlterEnum (add PENDING to PurchaseStatus)
ALTER TYPE "PurchaseStatus" ADD VALUE IF NOT EXISTS 'PENDING';

-- AlterTable: purchase — add new columns
ALTER TABLE "purchase"
  ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "paymentCode" TEXT,
  ADD COLUMN IF NOT EXISTS "sepayTransactionId" TEXT;

-- Convert paymentMethod from String to Enum
-- Step 1: Add new enum column
ALTER TABLE "purchase" ADD COLUMN IF NOT EXISTS "paymentMethod_new" "PaymentMethod" NOT NULL DEFAULT 'STRIPE';

-- Step 2: Copy existing data (map string values to enum)
UPDATE "purchase" SET "paymentMethod_new" = 'STRIPE' WHERE TRUE;

-- Step 3: Drop old column if it exists, rename new one
ALTER TABLE "purchase" DROP COLUMN IF EXISTS "paymentMethod";
ALTER TABLE "purchase" RENAME COLUMN "paymentMethod_new" TO "paymentMethod";

-- Convert productType from String to Enum
ALTER TABLE "purchase" ADD COLUMN IF NOT EXISTS "productType_new" "ProductType" NOT NULL DEFAULT 'KING_TEMPLATE';
UPDATE "purchase" SET "productType_new" = 'KING_TEMPLATE' WHERE TRUE;
ALTER TABLE "purchase" DROP COLUMN IF EXISTS "productType";
ALTER TABLE "purchase" RENAME COLUMN "productType_new" TO "productType";

-- Make stripePaymentId nullable (was NOT NULL)
ALTER TABLE "purchase" ALTER COLUMN "stripePaymentId" DROP NOT NULL;

-- AlterTable: webhook_event — add timestamps
ALTER TABLE "webhook_event"
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex: new unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "purchase_sepayTransactionId_key" ON "purchase"("sepayTransactionId");
CREATE UNIQUE INDEX IF NOT EXISTS "purchase_paymentCode_key" ON "purchase"("paymentCode");

-- CreateIndex: composite indexes
CREATE INDEX IF NOT EXISTS "purchase_userId_status_idx" ON "purchase"("userId", "status");
CREATE INDEX IF NOT EXISTS "purchase_paymentCode_idx" ON "purchase"("paymentCode");

-- CreateIndex: composite unique (one purchase per product per user)
CREATE UNIQUE INDEX IF NOT EXISTS "purchase_userId_productType_key" ON "purchase"("userId", "productType");
