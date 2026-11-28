import Bone from "@/components/dashboard/bone"

export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading"
      className="mx-auto w-full max-w-6xl px-6 py-10"
    >
      <span className="sr-only">Loading</span>
      <Bone className="mb-6 h-5 w-40" />

      <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          <Bone className="aspect-video w-full rounded-3xl" />
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Bone className="h-7 w-20 rounded-full" />
              <Bone className="h-7 w-20 rounded-full" />
              <Bone className="h-7 w-24 rounded-full" />
            </div>
            <Bone className="h-12 w-4/5" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Bone className="h-8 w-56" />
            <Bone className="h-5 w-full" />
            <Bone className="h-5 w-full" />
            <Bone className="h-5 w-2/3" />
          </div>
        </div>
        <Bone className="h-96 w-full rounded-3xl" />
      </div>
    </main>
  )
}
