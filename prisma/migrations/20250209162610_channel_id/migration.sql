/*
  Warnings:

  - Added the required column `channelId` to the `GameSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "channelId" TEXT NOT NULL;
