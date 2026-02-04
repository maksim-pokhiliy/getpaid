import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@app/server/auth";
import { prisma } from "@app/server/db";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const senderProfile = await prisma.senderProfile.findUnique({
    where: { userId: session.user.id },
  });

  const isOnboarding = pathname.includes("/onboarding");

  if (!senderProfile && !isOnboarding) {
    redirect("/app/onboarding");
  }

  return <>{children}</>;
}
