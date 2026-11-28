import Bone from "@/components/dashboard/bone"
import TuitionCardSkeleton from "@/components/dashboard/tuition-card-skeleton"
import { PAGE_SIZE } from "@/lib/styles/tuition-query"

export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading"
      className="mx-auto w-full max-w-7xl px-6 py-12"
    >
      <span className="sr-only">Loading</span>

      <div className="flex flex-col items-start gap-4">
        <Bone className="h-8 w-24 rounded-full" />
        <Bone className="h-12 w-72 max-w-full" />
        <Bone className="h-5 w-96 max-w-full" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_1fr] lg:items-start">
        <aside>
          {/* Mobile: collapsed filter bar */}
          <Bone className="h-16 w-full rounded-3xl lg:hidden" />

          {/* Desktop: full filter card */}
          <div className="hidden flex-col gap-5 rounded-3xl border-2 border-ink bg-white p-6 shadow-hard lg:flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Bone className="h-4 w-20" />
                <Bone className="h-12 w-full rounded-xl" />
              </div>
            ))}
            <div className="flex gap-3">
              <Bone className="h-12 flex-1 rounded-full" />
              <Bone className="h-12 w-24 rounded-full" />
            </div>
          </div>
        </aside>

        <section>
          <Bone className="mb-5 h-5 w-40" />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <li key={i}>
                <TuitionCardSkeleton />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
