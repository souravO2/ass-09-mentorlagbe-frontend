import Link from "next/link"
import { cn } from "@/lib/utils"

const base =
  "rounded-full border-2 border-ink px-5 py-2.5 text-center text-sm font-bold shadow-hard-sm"

export default function NavButtons({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <div className={cn("items-center gap-2.5", className)}>
      <Link
        href="/sign-in"
        onClick={onClick}
        className={cn(base, "bg-white text-ink")}
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        onClick={onClick}
        className={cn(base, "bg-blue text-white")}
      >
        Sign Up
      </Link>
    </div>
  )
}
