import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  page: number
  totalPages: number
  basePath: string
  query?: Record<string, string | undefined>
  className?: string
}

function pageList(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const sorted = [...new Set([1, total, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)

  const out: (number | "…")[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…")
    out.push(p)
  })
  return out
}

const itemClass =
  "grid h-11 min-w-11 place-items-center rounded-full border-2 border-ink px-4 text-sm font-bold"

export default function Pagination({
  page,
  totalPages,
  basePath,
  query,
  className,
}: Props) {
  if (totalPages <= 1) return null

  function href(p: number) {
    const sp = new URLSearchParams()
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value) sp.set(key, value)
    })
    if (p > 1) sp.set("page", String(p))
    const qs = sp.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className
      )}
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className={cn(itemClass, "flex gap-1 bg-white shadow-hard-sm")}
        >
          <ChevronLeft className="size-4" aria-hidden="true" /> Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(itemClass, "flex gap-1 bg-paper opacity-50")}
        >
          <ChevronLeft className="size-4" aria-hidden="true" /> Previous
        </span>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 font-bold">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              itemClass,
              p === page
                ? "bg-lemon shadow-hard-sm"
                : "bg-white hover:bg-lemon/50"
            )}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          className={cn(itemClass, "flex gap-1 bg-white shadow-hard-sm")}
        >
          Next <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(itemClass, "flex gap-1 bg-paper opacity-50")}
        >
          Next <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  )
}
