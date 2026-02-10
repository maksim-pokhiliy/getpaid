import { NextResponse } from "next/server";

import { parseBody, withAuth } from "@app/shared/api/route-helpers";
import { createInvoiceSchema } from "@app/shared/schemas";

import { createInvoice, getInvoices } from "@app/server/invoices";

export const GET = withAuth(async (user) => {
  const invoices = await getInvoices(user.id);

  return NextResponse.json(invoices);
});

export const POST = withAuth(async (user, request) => {
  const { data, error } = await parseBody(request, createInvoiceSchema);

  if (error) {
    return error;
  }

  const invoice = await createInvoice(user.id, data);

  return NextResponse.json(invoice, { status: 201 });
});
