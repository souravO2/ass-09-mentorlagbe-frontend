import MyTuitions from "@/components/dashboard/tutor/my-tuitions"
import { getServerSession } from "@/lib/serverSession"
import { Tuition } from "@/lib/types/tuition"

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

  return <MyTuitions initialTuitions={tuitions} />
}
