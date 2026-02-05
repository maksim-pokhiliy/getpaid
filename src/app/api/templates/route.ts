import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, AuthenticationError } from "@app/server/auth/require-user";
import { getTemplates, createTemplate } from "@app/server/templates";

const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  currency: z.string().optional(),
  discount: z
    .object({
      type: z.enum(["PERCENTAGE", "FIXED"]),
      value: z.number().min(0),
    })
    .optional(),
  taxRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  dueDays: z.number().min(1).optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0),
      })
    )
    .min(1, "At least one item is required"),
});

export async function GET() {
  try {
    const user = await requireUser();
    const templates = await getTemplates(user.id);

    return NextResponse.json(templates);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    console.error("Get templates error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = createTemplateSchema.safeParse(body);

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

    const template = await createTemplate(user.id, parsed.data);

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    console.error("Create template error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
