import MyTuitionsTable from "@/components/dashboard/tutor/my-tuitions-table"
import { buttonVariants } from "@/components/ui/button"
import { getServerSession } from "@/lib/serverSession"
import { Tuition } from "@/lib/types/tuition"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default async function MyTuitionsPage() {
  // TODO: fetch the logged-in tutor's tuitions here.
  // Convert _id (and tutorId) to strings and createdAt to an ISO string before passing it in.
  const session = await getServerSession()
  if (!session || !session.user) {
    return <div>Please log in to view your tuitions.</div>
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tuitions?tutorId=${session?.user.id}`
  )
  const data = await res.json()

  if (!res.ok) {
    return <div>Failed to fetch tuitions. Please try again later.</div>
  }

  const tuitions: Tuition[] = data

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
            My tuitions
          </h1>
          <p className="mt-1 text-sm font-medium text-ink-soft sm:text-base">
            Edit, close or delete your posts.
          </p>
        </div>
        <Link
          href="/dashboard/tutor/post-tuition"
          className={cn(
            buttonVariants(),
            "h-12 rounded-full border-2 border-ink bg-lemon px-7 font-extrabold text-ink shadow-hard transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black]"
          )}
        >
          Post a tuition
        </Link>
      </header>
      {tuitions.length === 0 ? (
        <div className="rounded-3xl border-2 border-ink bg-white p-10 text-center shadow-hard">
          <h2 className="font-heading text-2xl font-black">No tuitions yet</h2>
          <p className="mt-2 text-ink-soft">
            Post your first batch and it will show up here.
          </p>
        </div>
      ) : (
        <MyTuitionsTable tuitions={tuitions} />
      )}
    </main>
  )
}
