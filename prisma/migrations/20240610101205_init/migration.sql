/*
  Warnings:

  - Added the required column `hederaAccId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hederaPubKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'DISABLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hederaAccId" TEXT NOT NULL,
ADD COLUMN     "hederaPubKey" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
