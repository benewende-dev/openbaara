-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'draft',
    "category" TEXT NOT NULL,
    "ventureSlug" TEXT,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT,
    "excerptFr" TEXT NOT NULL,
    "excerptEn" TEXT,
    "bodyFr" TEXT NOT NULL,
    "bodyEn" TEXT,
    "faq" JSONB NOT NULL DEFAULT '[]',
    "authorName" TEXT NOT NULL DEFAULT 'Yannick Benewende Rapadamnaba',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_publishedAt_idx" ON "articles"("status", "publishedAt");
