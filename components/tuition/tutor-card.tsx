export default function TutorCard({
  name,
  postedOn,
}: {
  name: string
  postedOn: string
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-lilac p-5 shadow-hard">
      <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-ink bg-white font-heading text-xl font-black">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-wide uppercase">Your tutor</p>
        <h3 className="truncate font-heading text-xl font-black">{name}</h3>
        <p className="text-sm font-medium">Posted on {postedOn}</p>
      </div>
    </div>
  )
}
