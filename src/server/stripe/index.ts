import Stripe from "stripe";
import { prisma } from "@app/server/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function createCheckoutSession(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: true,
      items: true,
      user: {
        include: {
          senderProfile: true,
        },
      },
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  if (invoice.status === "PAID" || invoice.paidAt) {
    throw new Error("Invoice is already paid");
  }

  const senderName =
    invoice.user.senderProfile?.companyName ||
    invoice.user.senderProfile?.displayName ||
    invoice.user.email;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: invoice.client.email,
    line_items: invoice.items.map((item) => ({
      price_data: {
        currency: invoice.currency.toLowerCase(),
        product_data: {
          name: item.description,
        },
        unit_amount: item.unitPrice,
      },
      quantity: item.quantity,
    })),
    metadata: {
      invoiceId: invoice.id,
      publicId: invoice.publicId,
    },
    success_url: `${APP_URL}/i/${invoice.publicId}?paid=1`,
    cancel_url: `${APP_URL}/i/${invoice.publicId}?canceled=1`,
    payment_intent_data: {
      description: `Invoice ${invoice.publicId} from ${senderName}`,
    },
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { stripeCheckoutSessionId: session.id },
  });

  return session;
}

export async function handleWebhookEvent(
  body: string,
  signature: string
): Promise<{ type: string; handled: boolean }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Stripe webhook secret not configured");
  }

  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid" && session.metadata?.invoiceId) {
        const invoice = await prisma.invoice.findFirst({
          where: {
            id: session.metadata.invoiceId,
            paidAt: null,
          },
        });

        if (invoice) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
              status: "PAID",
              paidAt: new Date(),
              paymentMethod: "STRIPE",
            },
          });

          await prisma.invoiceEvent.create({
            data: {
              invoiceId: invoice.id,
              type: "PAID_STRIPE",
              payload: {
                checkoutSessionId: session.id,
                paymentIntent:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : (session.payment_intent?.id ?? null),
              },
            },
          });

          await prisma.followUpJob.updateMany({
            where: { invoiceId: invoice.id, status: "PENDING" },
            data: { status: "CANCELED" },
          });
        }
      }

      return { type: event.type, handled: true };
    }

    default:
      return { type: event.type, handled: false };
  }
}

export { stripe };
