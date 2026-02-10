-- DropIndex: remove redundant single-column index (covered by composite userId+status index)
DROP INDEX IF EXISTS "purchase_userId_idx";

-- AlterTable: make purchasedAt nullable (null while PENDING, set when COMPLETED)
ALTER TABLE "purchase" ALTER COLUMN "purchasedAt" DROP NOT NULL;
ALTER TABLE "purchase" ALTER COLUMN "purchasedAt" DROP DEFAULT;
