-- CreateTable
CREATE TABLE "DebtLend" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "personOfInterest" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'uncleared',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebtLend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DebtLend" ADD CONSTRAINT "DebtLend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
