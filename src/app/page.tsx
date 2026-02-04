import { redirect } from "next/navigation";
import { auth } from "@app/server/auth";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/app");
  }

  redirect("/auth/sign-in");
}
