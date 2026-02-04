import { NextResponse } from "next/server";
import { handleWebhookEvent } from "@app/server/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: { code: "MISSING_SIGNATURE", message: "Missing stripe-signature header" } },
        { status: 400 }
      );
    }

    const result = await handleWebhookEvent(body, signature);

    return NextResponse.json({
      received: true,
      type: result.type,
      handled: result.handled,
    });
  } catch (error) {
    console.error("Webhook error:", error);

    if (error instanceof Error && error.message.includes("signature")) {
      return NextResponse.json(
        { error: { code: "INVALID_SIGNATURE", message: "Invalid webhook signature" } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
