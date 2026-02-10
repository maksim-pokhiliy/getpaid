import { redirect } from "next/navigation";

import { LandingPage } from "@app/features/landing/components/landing-page";

import { auth } from "@app/server/auth";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/app");
  }

  return <LandingPage />;
}
