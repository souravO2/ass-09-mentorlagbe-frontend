import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl border-2 border-ink bg-white p-10 text-center shadow-hard",
        className
      )}
    >
      {Icon && (
        <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-lemon">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      <h2 className="font-heading text-2xl font-black">{title}</h2>
      {description && <p className="max-w-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
