-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'broker', 'expert');

-- CreateEnum
CREATE TYPE "ChapterActions" AS ENUM ('new', 'accept', 'skip', 'edit', 'flag');

-- CreateTable
CREATE TABLE "TempUser" (
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

    CONSTRAINT "TempUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "ChapterItem" (
    "id" SERIAL NOT NULL,
    "itemAction" TEXT DEFAULT 'new',
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
    "broker_id" INTEGER,

    CONSTRAINT "ChapterItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapters" (
    "id" SERIAL NOT NULL,
    "chapter_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "chapter_name" TEXT NOT NULL,
    "broker_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_email_key" ON "TempUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_email_key" ON "PasswordReset"("email");

-- AddForeignKey
ALTER TABLE "ChapterItem" ADD CONSTRAINT "ChapterItem_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterItem" ADD CONSTRAINT "ChapterItem_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
