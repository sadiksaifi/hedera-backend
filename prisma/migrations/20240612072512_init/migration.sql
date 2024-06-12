-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "grant" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_grant_key" ON "Permission"("grant");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_userId_grant_key" ON "Permission"("userId", "grant");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
