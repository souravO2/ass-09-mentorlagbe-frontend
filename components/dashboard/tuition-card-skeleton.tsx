import Bone from "./bone"

export default function TuitionCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-hard">
      <Bone className="aspect-video rounded-none border-0 border-b-2" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex gap-2">
          <Bone className="h-6 w-20 rounded-full" />
          <Bone className="h-6 w-16 rounded-full" />
          <Bone className="h-6 w-20 rounded-full" />
        </div>
        <Bone className="h-6 w-full" />
        <Bone className="h-4 w-1/3" />
        <Bone className="h-4 w-1/2" />
        <Bone className="h-4 w-2/5" />
        <div className="mt-auto flex items-center justify-between pt-3">
          <Bone className="h-8 w-24" />
          <Bone className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}
