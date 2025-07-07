-- CreateEnum
CREATE TYPE "VIDEO_STATUS" AS ENUM ('DRAFT', 'PUBLISH');

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" "VIDEO_STATUS" NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
