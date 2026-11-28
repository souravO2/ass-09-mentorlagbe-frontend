"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/checkout", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
]

export default function NavLinks({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const session = useSession()

  return (
    <nav aria-label="Main" className={className}>
      {navItems.map(({ href, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full border-2 px-4 py-2 text-[15px] font-bold transition-colors",
              active
                ? "border-ink bg-lemon"
                : "border-transparent hover:bg-lemon/50"
            )}
          >
            {label}
          </Link>
        )
      })}
      {session?.data && (
        <Link
          href="/dashboard"
          onClick={onNavigate}
          aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
          className={cn(
            "rounded-full border-2 px-4 py-2 text-[15px] font-bold transition-colors",
            pathname.startsWith("/dashboard")
              ? "border-ink bg-lemon"
              : "border-transparent hover:bg-lemon/50"
          )}
        >
          Dashboard
        </Link>
      )}
    </nav>
  )
}
