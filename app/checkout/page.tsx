"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Check, Loader2, Lock, ShieldCheck } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import PageHeader from "@/components/tuition/page-header"
import { authClient } from "@/lib/auth-client"
import { plans, type PlanRole } from "@/lib/plans"
import { cn } from "@/lib/utils"

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-white p-8 text-center shadow-hard">
      <h2 className="font-heading text-2xl font-black">{title}</h2>
      {children}
    </div>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt
        className={cn(
          "text-sm",
          bold ? "font-extrabold" : "font-medium text-ink-soft"
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(bold ? "font-heading text-2xl font-black" : "font-bold")}
      >
        {value}
      </dd>
    </div>
  )
}

export default function CheckoutPage() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const role = user?.role as string | undefined
  const [paying, setPaying] = useState(false)

  async function handlePay() {
    if (paying) return
    setPaying(true)
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        throw new Error(data.message ?? "Could not start the payment")
      }
      window.location.href = data.url // keep the button disabled while redirecting
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
      setPaying(false)
    }
  }

  let content: ReactNode

  if (isPending) {
    content = (
      <div
        role="status"
        aria-label="Loading"
        className="h-96 animate-pulse rounded-3xl border-2 border-ink bg-lilac/40"
      />
    )
  } else if (!user) {
    content = (
      <Panel title="Sign in to continue">
        <p className="text-ink-soft">Sign in to upgrade your account to Pro.</p>
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants(),
            "mx-auto h-12 rounded-full border-2 border-ink bg-lemon px-8 font-extrabold text-ink shadow-hard-sm"
          )}
        >
          Sign In
        </Link>
      </Panel>
    )
  } else if (role !== "student" && role !== "tutor") {
    content = (
      <Panel title="No plan for this account">
        <p className="text-ink-soft">
          Pro plans are for students and tutors only.
        </p>
      </Panel>
    )
  } else if (user.plan === "pro") {
    content = (
      <Panel title="You are already on Pro">
        <p className="text-ink-soft">Your Pro features are active.</p>
        <Link
          href={`/dashboard/${role}`}
          className={cn(
            buttonVariants(),
            "mx-auto h-12 rounded-full border-2 border-ink bg-blue px-8 font-bold text-white shadow-hard-sm"
          )}
        >
          Go to Dashboard
        </Link>
      </Panel>
    )
  } else {
    const plan = plans[role as PlanRole]

    content = (
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
        {/* Plan summary */}
        <section
          aria-label="Plan summary"
          className="flex flex-col gap-5 rounded-3xl border-2 border-ink bg-lilac p-6 shadow-hard sm:p-8"
        >
          <span className="w-fit rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold tracking-wide uppercase">
            {role === "tutor" ? "For tutors" : "For students"}
          </span>
          <div>
            <h2 className="font-heading text-3xl font-black">{plan.name}</h2>
            <p className="mt-2 font-heading text-5xl font-black">
              ${plan.price}
              <span className="text-lg font-bold"> one-time</span>
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 font-bold">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-mint">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </section>

        {/* Payment details */}
        <section
          aria-label="Payment details"
          className="flex flex-col gap-5 rounded-3xl border-2 border-ink bg-white p-6 shadow-hard sm:p-8"
        >
          <h2 className="font-heading text-2xl font-black">Payment details</h2>

          <dl className="flex flex-col gap-3">
            <Row label="Account" value={user.name} />
            <Row label="Email" value={user.email} />
            <Row label="Role" value={role === "tutor" ? "Tutor" : "Student"} />
            <Row label="Plan" value={plan.name} />
          </dl>

          <div className="border-t-2 border-ink pt-4">
            <dl>
              <Row label="Total due" value={`$${plan.price}.00`} bold />
            </dl>
          </div>

          <Button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="h-12 cursor-pointer rounded-full border-2 border-ink bg-lemon text-base font-extrabold text-ink shadow-hard transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black] disabled:translate-y-0 disabled:opacity-60"
          >
            {paying ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Redirecting to Stripe…
              </>
            ) : (
              <>
                <Lock className="mr-2 size-4" aria-hidden="true" />
                Pay ${plan.price} now
              </>
            )}
          </Button>

          <p className="flex items-center justify-center gap-2 text-xs font-medium text-ink-soft">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Secure payment powered by Stripe
          </p>
        </section>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <PageHeader
        title="Upgrade to"
        highlight="Pro"
        description="Review your plan, then pay securely with Stripe."
        className="mb-10"
      />
      {content}
    </main>
  )
}
