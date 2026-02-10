import { NextResponse } from "next/server";

import { notFoundResponse, withAuth } from "@app/shared/api/route-helpers";

import { duplicateInvoice } from "@app/server/invoices";

export const POST = withAuth(async (user, _request, context) => {
  const { id } = await context.params;
  const invoice = await duplicateInvoice(id, user.id);

  if (!invoice) {
    return notFoundResponse("Invoice");
  }

  return NextResponse.json(invoice);
});
