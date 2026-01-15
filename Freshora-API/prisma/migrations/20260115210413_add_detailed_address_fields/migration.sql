-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "country" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "recipientName" TEXT;
