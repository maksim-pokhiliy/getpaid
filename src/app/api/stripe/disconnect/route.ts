import { NextResponse } from "next/server";
import { requireUser, AuthenticationError } from "@app/server/auth/require-user";
import { prisma } from "@app/server/db";
import { disconnectStripeAccount } from "@app/server/stripe";

export async function POST() {
  try {
    const user = await requireUser();

    // Get the user's sender profile
    const senderProfile = await prisma.senderProfile.findUnique({
      where: { userId: user.id },
    });

    if (!senderProfile?.stripeAccountId) {
      return NextResponse.json(
        { error: { code: "NOT_CONNECTED", message: "No Stripe account connected" } },
        { status: 400 }
      );
    }

    try {
      // Deauthorize the connected account
      await disconnectStripeAccount(senderProfile.stripeAccountId);
    } catch (err) {
      // If deauthorization fails, log it but continue to clear local record
      console.error("Failed to deauthorize Stripe account:", err);
    }

    // Clear the stripe account ID from the profile
    await prisma.senderProfile.update({
      where: { userId: user.id },
      data: { stripeAccountId: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    console.error("Stripe disconnect error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to disconnect Stripe account" } },
      { status: 500 }
    );
  }
}
