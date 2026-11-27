import { CheckCircle2, Clock, FileText } from "lucide-react"
import DashboardOverview, {
  planStat,
} from "@/components/dashboard/dashboard-overview"
import { getServerSession } from "@/lib/serverSession"

export default async function StudentOverviewPage() {
  // TODO: fetch these for the logged-in student
  const session = await getServerSession()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/applications?studentId=${session?.user.id}`,
    {
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authentication headers here
      },
    }
  )
  const result = await res.json()
  const data = {
    total: result.length,
    accepted: result.filter(
      (app: { status: string }) => app.status === "accepted"
    ).length,
    pending: result.filter(
      (app: { status: string }) => app.status === "pending"
    ).length,
    plan: session?.user.plan as "free" | "pro",
  }

  return (
    <DashboardOverview
      title="Student"
      highlight="overview"
      description="Your applications at a glance."
      stats={[
        {
          label: "Total applied tuitions",
          value: data.total,
          icon: FileText,
          color: "lilac",
          href: "/dashboard/student/my-applications",
        },
        {
          label: "Accepted applications",
          value: data.accepted,
          icon: CheckCircle2,
          color: "mint",
          href: "/dashboard/student/my-applications?status=accepted",
        },
        {
          label: "Pending applications",
          value: data.pending,
          icon: Clock,
          color: "lemon",
          href: "/dashboard/student/my-applications?status=pending",
        },
        planStat(data.plan),
      ]}
    />
  )
}
