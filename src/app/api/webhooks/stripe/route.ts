import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Attempt client reference id first, fallback to metadata
    const userId = session.client_reference_id || session.metadata?.userId;
    const amountInCents = session.amount_total;

    if (userId && amountInCents) {
      const amountInDollars = amountInCents / 100;
      
      try {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { walletBalance: { increment: amountInDollars } }
          }),
          prisma.transaction.create({
            data: { userId, type: 'DEPOSIT', amount: amountInDollars }
          })
        ]);
        console.log(`Successfully credited $${amountInDollars} to user ${userId}`);
      } catch(error) {
        console.error("Failed to update database for Stripe deposit:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
