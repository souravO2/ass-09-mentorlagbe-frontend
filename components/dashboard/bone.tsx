import { cn } from "@/lib/utils"

export default function Bone({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-lg border-2 border-ink bg-lilac/40",
        className
      )}
    />
  )
}
