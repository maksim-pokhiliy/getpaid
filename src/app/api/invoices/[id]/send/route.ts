import { NextResponse } from "next/server";
import { prisma } from "@app/server/db";
import { requireUser, AuthenticationError } from "@app/server/auth/require-user";
import { sendInvoiceEmail } from "@app/server/email";
import { getFollowUpRule, scheduleFollowUps } from "@app/server/followups";
import { logInvoiceEvent, updateInvoiceStatus } from "@app/server/invoices";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: user.id },
      include: {
        client: true,
        user: {
          include: {
            senderProfile: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Invoice not found" } },
        { status: 404 }
      );
    }

    if (invoice.status !== "DRAFT") {
      return NextResponse.json(
        { error: { code: "ALREADY_SENT", message: "Invoice has already been sent" } },
        { status: 400 }
      );
    }

    const senderName =
      invoice.user.senderProfile?.companyName ||
      invoice.user.senderProfile?.displayName ||
      invoice.user.email;

    try {
      await sendInvoiceEmail({
        clientName: invoice.client.name,
        clientEmail: invoice.client.email,
        senderName,
        publicId: invoice.publicId,
        total: invoice.total,
        currency: invoice.currency,
        dueDate: invoice.dueDate,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return NextResponse.json(
        { error: { code: "EMAIL_FAILED", message: "Failed to send invoice email" } },
        { status: 500 }
      );
    }

    const sentAt = new Date();

    await updateInvoiceStatus(invoice.id, "SENT", { sentAt });
    await logInvoiceEvent(invoice.id, "SENT", { clientEmail: invoice.client.email });

    const followUpRule = await getFollowUpRule(user.id);
    if (followUpRule?.enabled) {
      await scheduleFollowUps(invoice.id, sentAt, invoice.dueDate, {
        mode: followUpRule.mode,
        delaysDays: followUpRule.delaysDays as number[],
      });
    }

    const updated = await prisma.invoice.findUnique({
      where: { id: invoice.id },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    console.error("Send invoice error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
