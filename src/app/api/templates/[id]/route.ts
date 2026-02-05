import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, AuthenticationError } from "@app/server/auth/require-user";
import { getTemplate, updateTemplate, deleteTemplate } from "@app/server/templates";

const updateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  currency: z.string().optional(),
  discount: z
    .object({
      type: z.enum(["PERCENTAGE", "FIXED"]),
      value: z.number().min(0),
    })
    .nullable()
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
    .min(1)
    .optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const template = await getTemplate(id, user.id);

    if (!template) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Template not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    console.error("Get template error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateTemplateSchema.safeParse(body);

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

    const template = await updateTemplate(id, user.id, parsed.data);

    if (!template) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Template not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    console.error("Update template error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const result = await deleteTemplate(id, user.id);

    if (!result) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Template not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    console.error("Delete template error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
