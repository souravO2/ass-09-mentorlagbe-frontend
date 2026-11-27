import React from "react"
import TuitionCard, { TuitionCardData } from "../tuition/tuition-card"
import PageHeader from "../tuition/page-header"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const FreshTuitions = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuitions/fresh`, {
    cache: "no-store",
  })
  const freshTutions: TuitionCardData[] = await res.json()
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Fresh" highlight="tuitions" className="mb-6" />
      {freshTutions.length === 0 && (
        <p className="text-center text-ink/70">
          No fresh tuitions available at the moment.
        </p>
      )}
      {freshTutions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {freshTutions.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      )}
      <div className="mt-8 flex w-full justify-center">
        <Link
          href="/tuitions"
          className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-lemon px-6 py-3 font-bold text-ink shadow-hard transition-all duration-200 hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
        >
          View all tuitions
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default FreshTuitions
