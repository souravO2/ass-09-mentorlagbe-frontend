import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const styles = {
  pending: "bg-lemon",
  accepted: "bg-mint",
  rejected: "bg-coral",
} as const

export default function StatusBadge({
  status,
  className,
}: {
  status: keyof typeof styles
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-2 border-ink font-extrabold text-ink capitalize",
        styles[status],
        className
      )}
    >
      {status}
    </Badge>
  )
}
