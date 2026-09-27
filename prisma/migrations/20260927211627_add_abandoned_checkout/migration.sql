-- CreateTable
CREATE TABLE "AbandonedCheckout" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "addOnName" TEXT,
    "addOnPriceCents" INTEGER,
    "amountTotalCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbandonedCheckout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AbandonedCheckout_stripeSessionId_key" ON "AbandonedCheckout"("stripeSessionId");

-- CreateIndex
CREATE INDEX "AbandonedCheckout_email_idx" ON "AbandonedCheckout"("email");
