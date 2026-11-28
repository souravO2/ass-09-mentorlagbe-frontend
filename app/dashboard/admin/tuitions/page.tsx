import AdminTuitionApprovals from "@/components/dashboard/admin/admin-tuition-approval"
import { getServerSession } from "@/lib/session/serverSession"
import { Tuition } from "@/lib/types/tuition"

export default async function AdminTuitionApprovalsPage() {
  const session = await getServerSession()
  const token = session?.session.token
  if (!session || session.user.role !== "admin") {
    throw new Error("User is not an admin or not logged in")
  }

  // Replace with your existing admin endpoint.
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuitions/all`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      // Add any necessary authentication headers here
      authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tuition posts")
  }

  const applications: Tuition[] = await res.json()

  console.log("applications", applications)

  return <AdminTuitionApprovals initialApplications={applications} />
}
