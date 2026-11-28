import type { Metadata } from "next"
import Link from "next/link"
import { XCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Payment cancelled | MentorLagbe",
}

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="grid size-20 place-items-center rounded-full border-2 border-ink bg-coral shadow-hard">
        <XCircle className="size-10" aria-hidden="true" />
      </span>

      <div>
        <h1 className="font-heading text-4xl font-black">Payment cancelled</h1>
        <p className="mt-2 text-ink-soft">
          No charge was made and your plan has not changed. You can upgrade
          whenever you are ready.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/checkout"
          className={cn(
            buttonVariants(),
            "h-12 rounded-full border-2 border-ink bg-lemon px-8 font-extrabold text-ink shadow-hard-sm"
          )}
        >
          Try again
        </Link>
        <Link
          href="/checkout"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 rounded-full border-2 border-ink bg-white px-6 font-bold"
          )}
        >
          Back to Pricing
        </Link>
      </div>
    </main>
  )
}
