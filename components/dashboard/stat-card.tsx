import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const colors = {
  lemon: "bg-lemon",
  mint: "bg-mint",
  lilac: "bg-lilac",
  sky: "bg-sky",
  coral: "bg-coral",
} as const

export type OverviewStat = {
  label: string
  value: string | number
  icon: LucideIcon
  color: keyof typeof colors
  href?: string // makes the whole card a link
  hint?: string // small text under the label
}

export default function StatCard({ stat }: { stat: OverviewStat }) {
  const { label, value, icon: Icon, color, href, hint } = stat

  const body = (
    <>
      <span
        className={cn(
          "grid size-12 place-items-center rounded-xl border-2 border-ink",
          colors[color]
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-4xl leading-none font-black">{value}</p>
        <p className="mt-2 text-sm font-bold">{label}</p>
        {hint && <p className="text-xs font-medium text-ink-soft">{hint}</p>}
      </div>
    </>
  )

  const base =
    "flex h-full flex-col gap-5 rounded-2xl border-2 border-ink bg-white p-6 shadow-hard"

  return href ? (
    <Link
      href={href}
      className={cn(
        base,
        "transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black]"
      )}
    >
      {body}
    </Link>
  ) : (
    <div className={base}>{body}</div>
  )
}