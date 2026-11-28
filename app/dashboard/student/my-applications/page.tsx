import MyApplications from "@/components/dashboard/student/my-applications"
import { getServerSession } from "@/lib/session/serverSession"
import type { Application } from "@/lib/types/application"

export default async function MyApplicationsPage() {
  // TODO: fetch the logged-in student's applications here (newest first).
  // Convert _id to a string and appliedAt to an ISO string before passing them in.
  const session = await getServerSession()
  if (!session || session.user.role !== "student") {
    throw new Error("User is not a student or not logged in")
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/applications?studentId=${session.user.id}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session.session.token}`,
      },
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch applications")
  }
  const applications: Application[] = await res.json()

  return <MyApplications initialApplications={applications} />
}
