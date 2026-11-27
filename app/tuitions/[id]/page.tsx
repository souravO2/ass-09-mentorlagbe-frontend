import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  MapPin,
  Monitor,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ApplyForm from "@/components/tuition/apply-form"
import InfoTile from "@/components/tuition/info-tile"
import TutorCard from "@/components/tuition/tutor-card"
import type { Tuition } from "@/lib/types/tuition"
import { cn } from "@/lib/utils"
import { getServerSession } from "@/lib/serverSession"

async function getTuition(id: string, role?: string): Promise<Tuition> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuitions/${id}`, {
    cache: "no-store",
  })

  if (res.status === 404) notFound()

  if (!res.ok) {
    throw new Error("Failed to load the tuition")
  }

  const tuition: Tuition = await res.json()

  // important to check if the tuition is approved and active before rendering the page
  if (
    role !== "admin" &&
    (tuition.approvalStatus !== "approved" || !tuition.isActive)
  ) {
    notFound()
  }

  return tuition
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const session = await getServerSession()
  const role = session?.user?.role

  const t = await getTuition(id, role)

  return {
    title: `${t.title} | MentorLagbe`,
    description: t.description.slice(0, 150),
  }
}

const tagClass = "rounded-full border-2 border-ink font-bold text-ink"

export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession()
  const role = session?.user.role
  const t = await getTuition(id, role)

  const postedOn = new Date(t.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      {role === "admin" && (
        <div className="mb-6 flex w-full items-center justify-center text-6xl font-bold text-red-600">
          Admin View
        </div>
      )}
      <Link
        href="/tuitions"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink/65 transition hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to all tuitions
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
        <article className="flex min-w-0 flex-col gap-8">
          <div className="aspect-video overflow-hidden rounded-3xl border-2 border-ink bg-lilac/40 shadow-hard">
            {t.bannerImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={t.bannerImage}
                alt={`Banner for ${t.title}`}
                className="size-full object-cover"
              />
            )}
          </div>

          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={cn(tagClass, "bg-lemon")}>
                {t.subject}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  tagClass,
                  t.mode === "Online" ? "bg-mint" : "bg-sky"
                )}
              >
                {t.mode}
              </Badge>
              <Badge variant="outline" className={cn(tagClass, "bg-white")}>
                {t.classLevel}
              </Badge>
            </div>
            <h1 className="font-heading text-4xl leading-[1.05] font-black tracking-tight sm:text-5xl">
              {t.title}
            </h1>
          </header>

          <section
            aria-label="Tuition details"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <InfoTile
              icon={Wallet}
              label="Monthly fee"
              value={`৳${t.monthlyFee.toLocaleString("en-US")}`}
            />
            <InfoTile
              icon={CalendarDays}
              label="Schedule"
              value={`${t.daysPerWeek} days per week`}
            />
            <InfoTile
              icon={GraduationCap}
              label="Class level"
              value={t.classLevel}
            />
            <InfoTile
              icon={t.mode === "Online" ? Monitor : MapPin}
              label={t.mode === "Online" ? "Mode" : "Location"}
              value={t.mode === "Online" ? "Online" : t.location}
            />
          </section>

          <section>
            <h2 className="mb-3 font-heading text-3xl font-black tracking-tight">
              About this tuition
            </h2>
            <p className="text-lg leading-relaxed whitespace-pre-line text-ink-soft">
              {t.description}
            </p>
          </section>

          <TutorCard name={t.tutorName} postedOn={postedOn} />
        </article>

        <aside className="lg:sticky lg:top-28">
          <ApplyForm tuition={t} />
        </aside>
      </div>
    </main>
  )
}
