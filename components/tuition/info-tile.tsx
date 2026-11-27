import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function InfoTile({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border-2 border-ink bg-white p-4 shadow-hard-sm",
        className
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-lemon">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">
          {label}
        </p>
        <p className="truncate font-heading text-lg font-black">{value}</p>
      </div>
    </div>
  )
}
