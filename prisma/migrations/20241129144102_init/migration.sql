-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'broker', 'expert');

-- CreateEnum
CREATE TYPE "ChapterActions" AS ENUM ('new', 'accept', 'skip', 'edit', 'flag');

-- CreateTable
CREATE TABLE "TempUsers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "experience" INTEGER,
    "specialty" TEXT,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TempUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "profileImage" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "experience" INTEGER,
    "specialty" TEXT,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'broker',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterItems" (
    "id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_link" TEXT,
    "item_image" TEXT,
    "item_price" DOUBLE PRECISION,
    "item_weight" DOUBLE PRECISION,
    "item_detail" TEXT,
    "search_sentence" TEXT,
    "original_hs_code" INTEGER,
    "broker_hs_code" INTEGER,
    "expert_hs_code" INTEGER,
    "created_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "broker_update_timestamp" TIMESTAMP(3),
    "expert_update_timestamp" TIMESTAMP(3),
    "status" TEXT,
    "expert_status" TEXT,
    "user_id" INTEGER,

    CONSTRAINT "ChapterItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapters" (
    "id" SERIAL NOT NULL,
    "chapter_no" INTEGER NOT NULL,
    "chapter_name" TEXT NOT NULL,
    "chapter_disc" TEXT NOT NULL,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "Chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sections" (
    "id" SERIAL NOT NULL,
    "section_no" INTEGER NOT NULL,
    "section_name" TEXT NOT NULL,
    "section_disc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "chapter_item_id" INTEGER NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempUsers_email_key" ON "TempUsers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_email_key" ON "PasswordReset"("email");

-- AddForeignKey
ALTER TABLE "ChapterItems" ADD CONSTRAINT "ChapterItems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterItems" ADD CONSTRAINT "ChapterItems_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_chapter_item_id_fkey" FOREIGN KEY ("chapter_item_id") REFERENCES "ChapterItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
