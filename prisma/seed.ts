// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  // -------------------------
  // 1) Seed Users (idempotent)
  // -------------------------
  const ownerEmail = "owner@local.test";
  const adminEmail = "admin@local.test";
  const memberEmail = "member@local.test";

  const [owner, admin, member] = await Promise.all([
    prisma.user.upsert({
      where: { email: ownerEmail },
      update: { name: "Owner" },
      create: { email: ownerEmail, name: "Owner" },
    }),
    prisma.user.upsert({
      where: { email: adminEmail },
      update: { name: "Admin" },
      create: { email: adminEmail, name: "Admin" },
    }),
    prisma.user.upsert({
      where: { email: memberEmail },
      update: { name: "Member" },
      create: { email: memberEmail, name: "Member" },
    }),
  ]);

  // -------------------------
  // 2) Seed Organization (idempotent via unique slug)
  // -------------------------
  const org = await prisma.organization.upsert({
    where: { slug: "dev-org" },
    update: { name: "Dev Organization" },
    create: { slug: "dev-org", name: "Dev Organization" },
  });

  // -------------------------
  // 3) Seed Memberships (idempotent via compound unique userId+orgId)
  // selector name assumed: userId_orgId
  // -------------------------
  const [mOwner, mAdmin, mMember] = await Promise.all([
    prisma.membership.upsert({
      where: { userId_orgId: { userId: owner.id, orgId: org.id } },
      update: { role: "OWNER" },
      create: { userId: owner.id, orgId: org.id, role: "OWNER" },
    }),
    prisma.membership.upsert({
      where: { userId_orgId: { userId: admin.id, orgId: org.id } },
      update: { role: "ADMIN" },
      create: { userId: admin.id, orgId: org.id, role: "ADMIN" },
    }),
    prisma.membership.upsert({
      where: { userId_orgId: { userId: member.id, orgId: org.id } },
      update: { role: "MEMBER" },
      create: { userId: member.id, orgId: org.id, role: "MEMBER" },
    }),
  ]);

  // -------------------------
  // 4) Seed Invite (idempotent via stable token)
  // -------------------------
  const stableInviteToken = "dev_invite_member_local_test_token_v1";
  const invite = await prisma.invite.upsert({
    where: { token: stableInviteToken },
    update: {
      orgId: org.id,
      email: "newmember@local.test",
      role: "MEMBER",
      status: "PENDING",
      invitedById: owner.id,
      expiresAt: daysFromNow(7),
    },
    create: {
      orgId: org.id,
      email: "newmember@local.test",
      role: "MEMBER",
      token: stableInviteToken,
      status: "PENDING",
      invitedById: owner.id,
      expiresAt: daysFromNow(7),
    },
  });

  // -------------------------
  // 5) Seed AuditLogs (avoid duplicates by deleting old marker)
  // -------------------------
  const auditAction = "seed.core_multitenant";
  await prisma.auditLog.deleteMany({
    where: {
      orgId: org.id,
      action: auditAction,
    },
  });

  const audit = await prisma.auditLog.create({
    data: {
      orgId: org.id,
      actorId: owner.id,
      action: auditAction,
    },
  });

  console.log("✅ Seed complete");
  console.log({
    org: { id: org.id, slug: org.slug, name: org.name },
    users: {
      owner: { id: owner.id, email: owner.email },
      admin: { id: admin.id, email: admin.email },
      member: { id: member.id, email: member.email },
    },
    memberships: [
      { id: mOwner.id, role: mOwner.role },
      { id: mAdmin.id, role: mAdmin.role },
      { id: mMember.id, role: mMember.role },
    ],
    invite: {
      id: invite.id,
      token: invite.token,
      expiresAt: invite.expiresAt,
      status: invite.status,
    },
    audit: { id: audit.id, action: audit.action, createdAt: audit.createdAt },
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
