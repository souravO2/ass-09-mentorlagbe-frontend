import type { ReactNode } from "react"
import { Crown } from "lucide-react"
import PageHeader from "@/components/tuition/page-header"
import StatCard, { type OverviewStat } from "@/components/dashboard/stat-card"

export function planStat(plan: "free" | "pro"): OverviewStat {
  return {
    label: "Current plan",
    value: plan === "pro" ? "Pro" : "Free",
    icon: Crown,
    color: plan === "pro" ? "mint" : "lemon",
    href: plan === "pro" ? undefined : "/pricing",
    hint: plan === "pro" ? undefined : "Upgrade to Pro",
  }
}

export default function DashboardOverview({
  title,
  highlight,
  description,
  stats,
  children,
}: {
  title: string
  highlight?: string
  description?: string
  stats: OverviewStat[]
  children?: ReactNode
}) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">
      <PageHeader
        title={title}
        highlight={highlight}
        description={description}
      />

      <section
        aria-label="Overview statistics"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      {children}
    </main>
  )
}
