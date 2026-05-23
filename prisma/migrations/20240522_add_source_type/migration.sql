-- AlterTable: add sourceType column to Story
ALTER TABLE "Story" ADD COLUMN IF NOT EXISTS "sourceType" TEXT NOT NULL DEFAULT 'generated';
