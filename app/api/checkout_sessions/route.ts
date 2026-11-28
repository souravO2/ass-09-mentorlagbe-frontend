import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getServerSession } from "@/lib/session/serverSession"

const PLANS = {
  student: {
    priceId: process.env.STRIPE_PRICE_STUDENT,
    name: "Student Pro",
    amount: 10,
  },
  tutor: {
    priceId: process.env.STRIPE_PRICE_TUTOR,
    name: "Tutor Pro",
    amount: 15,
  },
}

export async function POST() {
  const userSession = await getServerSession()
  if (!userSession) {
    return NextResponse.json(
      { message: "Please sign in first" },
      { status: 401 }
    )
  }

  const headersList = await headers()
  const origin = headersList.get("origin")
  const { user } = userSession

  const role = user.role as keyof typeof PLANS
  const plan = PLANS[role]
  if (!plan || !plan.priceId) {
    return NextResponse.json(
      { message: "No plan for this account" },
      { status: 400 }
    )
  }
  if (user.plan === "pro") {
    return NextResponse.json(
      { message: "You are already on Pro" },
      { status: 400 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: "payment",
      metadata: {
        userId: user.id,
        customerName: user.name,
        role,
        planName: plan.name,
        amount: Number(plan.amount),
        currency: "usd",
      },
      customer_email: user.email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: "Could not start the payment" },
      { status: 500 }
    )
  }
}
