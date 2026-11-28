import Bone from "./bone"

export default function ListPageSkeleton({
  chips = 4,
  rows = 6,
  withSearch = true,
}: {
  chips?: number
  rows?: number
  withSearch?: boolean
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10"
    >
      <span className="sr-only">Loading</span>

      {/* Page header */}
      <div className="flex flex-col gap-3">
        <Bone className="h-12 w-72 max-w-full" />
        <Bone className="h-5 w-96 max-w-full" />
      </div>

      {/* Status chips and search */}
      {(chips > 0 || withSearch) && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: chips }).map((_, i) => (
              <Bone key={i} className="h-10 w-28 rounded-full" />
            ))}
          </div>
          {withSearch && (
            <Bone className="h-12 w-full rounded-xl lg:max-w-xs" />
          )}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden rounded-3xl border-2 border-ink bg-white p-5 shadow-hard md:block">
        <div className="flex flex-col gap-4">
          <Bone className="h-6 w-full" />
          {Array.from({ length: rows }).map((_, i) => (
            <Bone key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="grid grid-cols-1 gap-4 md:hidden">
        {Array.from({ length: Math.min(rows, 4) }).map((_, i) => (
          <li
            key={i}
            className="flex flex-col gap-4 rounded-2xl border-2 border-ink bg-white p-5 shadow-hard-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <Bone className="h-6 w-2/3" />
              <Bone className="h-7 w-20 rounded-full" />
            </div>
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-3/4" />
            <Bone className="h-11 w-full rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
