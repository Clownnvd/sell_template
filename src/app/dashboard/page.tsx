import prisma from "@/lib/db";
import { requireUserId } from "@/lib/auth/server";
import { DashboardPage } from "@/components/dashboard/dashboard-page";

export default async function Page() {
  const userId = await requireUserId();

  const [user, purchase] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.purchase.findUnique({
      where: {
        one_purchase_per_product: { userId, productType: "KING_TEMPLATE" },
      },
      select: {
        id: true,
        status: true,
        productType: true,
        amount: true,
        githubInviteSent: true,
        githubUsername: true,
        purchasedAt: true,
      },
    }),
  ]);

  const completedPurchase = purchase?.status === "COMPLETED" ? {
    id: purchase.id,
    status: purchase.status as "COMPLETED",
    productType: purchase.productType,
    amount: purchase.amount,
    githubInviteSent: purchase.githubInviteSent,
    githubUsername: purchase.githubUsername,
    purchasedAt: purchase.purchasedAt?.toISOString() ?? null,
  } : null;

  return (
    <DashboardPage
      userName={user?.name ?? null}
      initialPurchase={completedPurchase}
    />
  );
}
