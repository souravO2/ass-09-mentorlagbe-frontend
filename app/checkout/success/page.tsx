import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { CheckCircle2, Clock, ExternalLink, XCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { getServerSession } from "@/lib/session/serverSession"
import { plans, type PlanRole } from "@/lib/plans"
import { stripe } from "@/lib/stripe"
import { cn } from "@/lib/utils"
import { checkoutVerify } from "@/lib/payment"

export const metadata: Metadata = { title: "Payment | MentorLagbe" }

async function getCheckoutSession(id: string) {
  try {
    return await stripe.checkout.sessions.retrieve(id, {
      expand: ["payment_intent.latest_charge"],
    })
  } catch {
    return null
  }
}

function StatusPanel({
  icon: Icon,
  color,
  title,
  text,
  href,
  cta,
}: {
  icon: LucideIcon
  color: string
  title: string
  text: string
  href: string
  cta: string
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <span
        className={cn(
          "grid size-16 place-items-center rounded-full border-2 border-ink",
          color
        )}
      >
        <Icon className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-heading text-3xl font-black">{title}</h1>
      <p className="text-ink-soft">{text}</p>
      <Link
        href={href}
        className={cn(
          buttonVariants(),
          "h-12 rounded-full border-2 border-ink bg-lemon px-8 font-extrabold text-ink shadow-hard-sm"
        )}
      >
        {cta}
      </Link>
    </main>
  )
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const userSession = await getServerSession()
  if (!userSession) redirect("/sign-in")

  const { session_id } = await searchParams
  if (!session_id) redirect("/checkout")

  const session = await getCheckoutSession(session_id)

  // Unknown session, or someone else's session
  if (!session || session.metadata?.userId !== userSession.user.id) {
    return (
      <StatusPanel
        icon={XCircle}
        color="bg-coral"
        title="We could not find this payment"
        text="If you were charged, contact support and we will sort it out."
        href="/checkout"
        cta="Back to checkout"
      />
    )
  }

  // The checkout was never finished
  if (session.status === "open" || session.status === "expired")
    redirect("/checkout")

  const result = await checkoutVerify(session_id)

  // Complete but the money has not arrived yet (delayed payment methods)
  if (session.payment_status !== "paid" || result.ok) {
    return (
      <StatusPanel
        icon={Clock}
        color="bg-lemon"
        title="Your payment is processing"
        text="We will upgrade your account as soon as it is confirmed."
        href="/dashboard/profile"
        cta="Go to Dashboard"
      />
    )
  }

  // await fulfillPayment(session) // saves the payment and sets plan: "pro"; safe to run twice

  const role = (session.metadata?.role ?? "student") as PlanRole
  const plan = plans[role]
  const intent =
    session.payment_intent && typeof session.payment_intent !== "string"
      ? session.payment_intent
      : null
  const charge =
    intent?.latest_charge && typeof intent.latest_charge !== "string"
      ? intent.latest_charge
      : null

  const rows: [string, string][] = [
    ["Plan", plan?.name ?? "Pro"],
    [
      "Amount paid",
      `$${((session.amount_total ?? 0) / 100).toFixed(2)} ${(session.currency ?? "usd").toUpperCase()}`,
    ],
    [
      "Date",
      new Date(session.created * 1000).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    ],
    ["Email", session.customer_details?.email ?? session.customer_email ?? "—"],
    ["Transaction ID", intent?.id ?? session.id],
  ]

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-6 py-16 text-center">
      <span className="grid size-20 place-items-center rounded-full border-2 border-ink bg-mint shadow-hard">
        <CheckCircle2 className="size-10" aria-hidden="true" />
      </span>

      <div>
        <h1 className="font-heading text-4xl font-black">Payment successful</h1>
        <p className="mt-2 text-ink-soft">
          Your {plan?.name ?? "Pro"} plan is now active.
        </p>
      </div>

      <dl className="flex w-full flex-col gap-3 rounded-3xl border-2 border-ink bg-white p-6 text-left shadow-hard">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="text-sm font-medium text-ink-soft">{label}</dt>
            <dd className="min-w-0 truncate font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={`/dashboard/${role}`}
          className={cn(
            buttonVariants(),
            "h-12 rounded-full border-2 border-ink bg-blue px-8 font-bold text-white shadow-hard-sm"
          )}
        >
          Go to Dashboard
        </Link>
        {charge?.receipt_url && (
          <a
            href={charge.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 rounded-full border-2 border-ink bg-white px-6 font-bold"
            )}
          >
            View receipt
            <ExternalLink className="ml-2 size-4" aria-hidden="true" />
          </a>
        )}
      </div>
    </main>
  )
}
