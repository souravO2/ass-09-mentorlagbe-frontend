import Link from "next/link"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 font-heading text-2xl font-black ${className}`}
    >
      <span className="grid size-9 place-items-center rounded-[10px] border-2 border-ink bg-blue text-sm text-white">
        ML
      </span>
      MentorLagbe
    </Link>
  )
}
