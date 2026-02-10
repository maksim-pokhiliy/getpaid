import { NextResponse } from "next/server";

import { notFoundResponse, withAuth } from "@app/shared/api/route-helpers";

import { markInvoicePaid } from "@app/server/invoices";

export const POST = withAuth(async (user, _request, context) => {
  const { id } = await context.params;
  const invoice = await markInvoicePaid(id, user.id, "MANUAL");

  if (!invoice) {
    return notFoundResponse("Invoice not found or already paid");
  }

  return NextResponse.json(invoice);
});
