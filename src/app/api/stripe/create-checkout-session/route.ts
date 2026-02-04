import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@app/server/stripe";

const schema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message ?? "Invalid input",
          },
        },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(parsed.data.invoiceId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);

    if (error instanceof Error) {
      if (error.message === "Invoice not found") {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Invoice not found" } },
          { status: 404 }
        );
      }
      if (error.message === "Invoice is already paid") {
        return NextResponse.json(
          { error: { code: "ALREADY_PAID", message: "Invoice is already paid" } },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
