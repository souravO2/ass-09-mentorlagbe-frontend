import Bone from "@/components/dashboard/bone"
import TuitionCardSkeleton from "@/components/dashboard/tuition-card-skeleton"

export default function Loading() {
  return (
    <main role="status" aria-label="Loading">
      <span className="sr-only">Loading</span>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Bone className="h-8 w-48 rounded-full" />
          <Bone className="h-16 w-full" />
          <Bone className="h-16 w-4/5" />
          <Bone className="h-6 w-3/4" />
          <Bone className="h-16 w-full rounded-full" />
        </div>
        <Bone className="hidden h-96 w-full rounded-3xl lg:block" />
      </section>

      {/* Featured tuitions */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Bone className="mb-8 h-10 w-72 max-w-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <TuitionCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Bone className="mb-8 h-10 w-64 max-w-full" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    </main>
  )
}
