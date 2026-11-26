import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found | MentorLagbe",
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-lemon px-6 py-16 text-center">
      <p className="font-heading text-[clamp(7rem,28vw,13rem)] leading-[0.9] font-black tracking-tight">
        404
      </p>
      <h1 className="font-heading text-3xl font-black tracking-tight md:text-4xl">
        This page took a day off
      </h1>
      <p className="max-w-md text-lg">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full border-2 border-ink bg-blue px-6 py-3 font-bold text-white shadow-hard-sm"
        >
          Back to Home
        </Link>
        <Link
          href="/tuitions"
          className="rounded-full border-2 border-ink bg-white px-6 py-3 font-bold text-ink shadow-hard-sm"
        >
          Browse Tuitions
        </Link>
      </div>
    </main>
  )
}
