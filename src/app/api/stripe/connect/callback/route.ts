import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@app/server/db";
import { connectStripeAccount } from "@app/server/stripe";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const STATE_MAX_AGE = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle errors from Stripe
  if (error) {
    console.error("Stripe Connect error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(`/app/settings?tab=payments&error=${encodeURIComponent(error)}`, APP_URL)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/app/settings?tab=payments&error=missing_params", APP_URL)
    );
  }

  try {
    // Decode and verify the state
    const stateData = JSON.parse(Buffer.from(state, "base64url").toString());

    // Check timestamp to prevent replay attacks
    if (Date.now() - stateData.timestamp > STATE_MAX_AGE) {
      return NextResponse.redirect(
        new URL("/app/settings?tab=payments&error=state_expired", APP_URL)
      );
    }

    const userId = stateData.userId;

    if (!userId) {
      return NextResponse.redirect(
        new URL("/app/settings?tab=payments&error=invalid_state", APP_URL)
      );
    }

    // Exchange code for connected account ID
    const stripeAccountId = await connectStripeAccount(code);

    // Update the user's sender profile with the connected account ID
    await prisma.senderProfile.upsert({
      where: { userId },
      update: { stripeAccountId },
      create: {
        userId,
        stripeAccountId,
        defaultCurrency: "USD",
      },
    });

    return NextResponse.redirect(
      new URL("/app/settings?tab=payments&success=stripe_connected", APP_URL)
    );
  } catch (err) {
    console.error("Stripe Connect callback error:", err);
    return NextResponse.redirect(
      new URL("/app/settings?tab=payments&error=connection_failed", APP_URL)
    );
  }
}
