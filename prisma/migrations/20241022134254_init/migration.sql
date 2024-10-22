-- CreateTable
CREATE TABLE "ChapterItem" (
    "id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_link" TEXT,
    "item_image" TEXT,
    "item_price" DOUBLE PRECISION,
    "item_weight" DOUBLE PRECISION,
    "item_detail" TEXT,
    "search_sentence" TEXT,
    "original_hs_code" INTEGER NOT NULL,
    "broker_hs_code" INTEGER,
    "expert_hs_code" INTEGER,
    "created_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "broker_update_timestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expert_update_timestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "expert_status" TEXT,

    CONSTRAINT "ChapterItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapters" (
    "id" SERIAL NOT NULL,
    "chapter_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "broker_id" INTEGER,

    CONSTRAINT "Chapters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChapterItem" ADD CONSTRAINT "ChapterItem_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
