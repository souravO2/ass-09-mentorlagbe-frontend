import type { Metadata } from "next"
import Link from "next/link"
import { SearchX } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PAGE_SIZE, parseTuitionQuery } from "@/lib/styles/tuition-query"
import { Tuition } from "@/lib/types/tuition"
import PageHeader from "@/components/tuition/page-header"
import TuitionFilters from "@/components/tuition/tuition-filter"
import TuitionCard from "@/components/tuition/tuition-card"
import EmptyState from "@/components/tuition/empty-state"
import Pagination from "@/components/tuition/pagination"

export const metadata: Metadata = {
  title: "Browse Tuitions | MentorLagbe",
  description:
    "Search and filter verified tuition batches by subject, class level and mode.",
}

export default async function TuitionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = parseTuitionQuery(await searchParams)
  const { search, subject, classLevel, mode, page } = query
  const activeFilters = { search, subject, classLevel, mode }

  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (subject) params.set("subject", subject)
  if (classLevel) params.set("classLevel", classLevel)
  if (mode) params.set("mode", mode)
  params.set("page", String(page))

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tuitions?${params}`,
    { cache: "no-store" }
  )
  const data: { tuitions: Tuition[]; total: number } = res.ok
    ? await res.json()
    : { tuitions: [], total: 0 }

  console.log(res)

  const tuitions = data.tuitions
  const total = data.total
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12">
      <PageHeader
        eyebrow="Browse"
        title="Browse"
        highlight="tuitions"
        description="Find an approved tutor by subject, class level and mode."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_1fr] lg:items-start">
        <aside className="lg:sticky lg:top-28">
          <TuitionFilters
            key={JSON.stringify(activeFilters)}
            defaults={activeFilters}
          />
        </aside>

        <section aria-label="Tuition results">
          <p
            className="mb-5 text-sm font-bold text-ink-soft"
            aria-live="polite"
          >
            {total} {total === 1 ? "tuition" : "tuitions"} found
          </p>

          {tuitions.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {tuitions.map((tuition) => (
                <li key={tuition._id}>
                  <TuitionCard tuition={tuition} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No tuitions found"
              description="Try a different search or clear the filters."
              action={
                <Link
                  href="/tuitions"
                  className={cn(
                    buttonVariants(),
                    "h-11 rounded-full border-2 border-ink bg-lemon px-6 font-extrabold text-ink shadow-hard-sm"
                  )}
                >
                  Clear filters
                </Link>
              }
            />
          )}

          <Pagination
            className="mt-10"
            page={page}
            totalPages={totalPages}
            basePath="/tuitions"
            query={activeFilters}
          />
        </section>
      </div>
    </main>
  )
}
