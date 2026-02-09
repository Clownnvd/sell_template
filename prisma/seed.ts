// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed demo users (idempotent via upsert)
  const users = [
    { email: "sarah.chen@example.com", name: "Sarah Chen" },
    { email: "marcus.johnson@example.com", name: "Marcus Johnson" },
    { email: "yuki.tanaka@example.com", name: "Yuki Tanaka" },
  ];

  const created = await Promise.all(
    users.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name },
        create: { email: u.email, name: u.name },
      })
    )
  );

  // Seed a completed purchase for the first user (idempotent)
  const buyer = created[0];
  const existingPurchase = await prisma.purchase.findFirst({
    where: { userId: buyer.id, productType: "KING_TEMPLATE" },
  });

  if (!existingPurchase) {
    await prisma.purchase.create({
      data: {
        userId: buyer.id,
        paymentMethod: "STRIPE",
        productType: "KING_TEMPLATE",
        amount: 9900,
        currency: "USD",
        status: "COMPLETED",
        stripePaymentId: `pi_seed_${buyer.id.slice(0, 8)}`,
        githubInviteSent: false,
        purchasedAt: new Date(),
      },
    });
  }

  console.log("Seed complete");
  console.log({
    users: created.map((u) => ({ id: u.id, email: u.email })),
  });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
