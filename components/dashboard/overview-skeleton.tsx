import Bone from "./bone"

export default function OverviewSkeleton({
  cards = 4,
  withSection = false,
}: {
  cards?: number
  withSection?: boolean // extra block under the cards, for overview pages that add a table
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10"
    >
      <span className="sr-only">Loading</span>

      {/* Page header */}
      <div className="flex flex-col gap-4">
        <Bone className="h-12 w-72 max-w-full" />
        <Bone className="h-6 w-96 max-w-full" />
      </div>

      {/* Stat cards, same grid as DashboardOverview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="flex h-full flex-col gap-5 rounded-2xl border-2 border-ink bg-white p-6 shadow-hard"
          >
            <Bone className="size-12 rounded-xl" />
            <div className="flex flex-col gap-2">
              <Bone className="h-10 w-20" />
              <Bone className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {withSection && (
        <div className="rounded-3xl border-2 border-ink bg-white p-6 shadow-hard">
          <Bone className="mb-5 h-7 w-48" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
