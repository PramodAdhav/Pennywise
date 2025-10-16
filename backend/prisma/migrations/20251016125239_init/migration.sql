-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "gmail" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_gmail_key" ON "Users"("gmail");
