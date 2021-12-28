-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ts" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Coal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mestorojdenie" TEXT NOT NULL,
    "name_of_coal" TEXT NOT NULL,
    "ospp" INTEGER NOT NULL DEFAULT 999999,
    "prihod" INTEGER NOT NULL DEFAULT 999999,
    "rashod" INTEGER NOT NULL DEFAULT 999999,
    "ostatok" INTEGER NOT NULL DEFAULT 999999,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER,
    CONSTRAINT "Coal_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
