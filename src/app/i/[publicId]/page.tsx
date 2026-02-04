import { notFound } from "next/navigation";
import { getInvoiceByPublicId } from "@app/server/invoices";
import PublicInvoiceView from "./PublicInvoiceView";

interface Props {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ paid?: string; canceled?: string }>;
}

export default async function PublicInvoicePage({ params, searchParams }: Props) {
  const { publicId } = await params;
  const { paid, canceled } = await searchParams;

  const invoice = await getInvoiceByPublicId(publicId);

  if (!invoice) {
    notFound();
  }

  const senderName =
    invoice.user.senderProfile?.companyName ||
    invoice.user.senderProfile?.displayName ||
    invoice.user.email;

  const senderAddress = invoice.user.senderProfile?.address || "";
  const senderTaxId = invoice.user.senderProfile?.taxId || "";
  const hasStripe = !!invoice.user.senderProfile?.stripeAccountId;

  return (
    <PublicInvoiceView
      publicId={publicId}
      invoice={{
        id: invoice.id,
        publicId: invoice.publicId,
        status: invoice.status,
        currency: invoice.currency,
        subtotal: invoice.subtotal,
        total: invoice.total,
        dueDate: invoice.dueDate.toISOString(),
        paidAt: invoice.paidAt?.toISOString() || null,
        createdAt: invoice.createdAt.toISOString(),
        client: {
          name: invoice.client.name,
          email: invoice.client.email,
        },
        items: invoice.items.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
        })),
        sender: {
          name: senderName,
          address: senderAddress,
          taxId: senderTaxId,
        },
      }}
      hasStripe={hasStripe}
      justPaid={paid === "1"}
      wasCanceled={canceled === "1"}
    />
  );
}
