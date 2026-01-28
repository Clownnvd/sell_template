// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed demo users (idempotent)
  const users = [
    { email: "owner@local.test", name: "Owner" },
    { email: "admin@local.test", name: "Admin" },
    { email: "member@local.test", name: "Member" },
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
