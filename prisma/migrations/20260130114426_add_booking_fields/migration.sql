/*
  Warnings:

  - Added the required column `address` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carMake` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carModel` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "carMake" TEXT NOT NULL,
ADD COLUMN     "carModel" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fuelType" TEXT NOT NULL;
