import TuitionApprovals from "@/components/dashboard/tutor/tuition-approvals"
import { getServerToken } from "@/lib/session/serverToken"
import { getServerSession } from "@/lib/session/serverSession"
import { Application } from "@/lib/types/application"

export default async function TuitionApprovalsPage() {
  const session = await getServerSession()
  const token = await getServerToken() // Fetch the server token for authentication

  if (!session || session.user.role !== "tutor") {
    throw new Error("User is not an admin or not logged in")
  }

  // Replace with your existing admin endpoint.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/applications?tutorId=${session.user.id}`,
    {
      cache: "no-store",
      headers: { authorization: `Bearer ${token}` },
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch tuition posts")
  }

  const applications: Application[] = await res.json()

  return <TuitionApprovals initialApplications={applications} />
}
