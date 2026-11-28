import { BookOpen, CheckCircle2, Users } from "lucide-react"
import DashboardOverview, {
  planStat,
} from "@/components/dashboard/dashboard-overview"
import { getServerSession } from "@/lib/session/serverSession"
import { getServerToken } from "@/lib/session/serverToken"

export default async function TutorOverviewPage() {
  // TODO: fetch these for the logged-in tutor
  const session = await getServerSession()
  const token = await getServerToken() // Fetch the server token for authentication
  const tuitionRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tuitions?tutorId=${session?.user.id}`,
    {
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authentication headers here
        authorization: `Bearer ${token}`, // Use the server token for authorization
      },
    }
  )
  const applicantsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/applications?tutorId=${session?.user.id}`,
    {
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authentication headers here
        authorization: `Bearer ${token}`, // Use the server token for authorization
      },
    }
  )
  const tuitionResResult = await tuitionRes.json()
  const applicantsResResult = await applicantsRes.json()
  console.log("Tutor tuitions result:", tuitionResResult) // Log the fetched data for debugging
  const data = {
    posted: tuitionResResult.length,
    approved: tuitionResResult.filter(
      (tuition: { approvalStatus: string; isActive: boolean }) =>
        tuition.approvalStatus === "approved" && tuition.isActive === true
    ).length,
    applicants: applicantsResResult.length, // This should be fetched based on the tutor's tuitions
    plan: session?.user.plan as "free" | "pro",
  }

  return (
    <DashboardOverview
      title="Tutor"
      highlight="overview"
      description="Your tuitions and applicants at a glance."
      stats={[
        {
          label: "Total tuitions posted",
          value: data.posted,
          icon: BookOpen,
          color: "lilac",
          href: "/dashboard/tutor/my-tuitions",
        },
        {
          label: "Active and approved Tuitions",
          value: data.approved,
          icon: CheckCircle2,
          color: "mint",
          href: "/dashboard/tutor/my-tuitions",
        },
        {
          label: "Pending Applicants",
          value: applicantsResResult.filter(
            (app: { status: string }) => app.status === "pending"
          ).length,
          icon: Users,
          color: "lemon",
          href: "/dashboard/tutor/applicants?status=pending",
        },
        {
          label: "Applicants received",
          value: data.applicants,
          icon: Users,
          color: "sky",
          href: "/dashboard/tutor/applicants",
        },
        planStat(data.plan),
      ]}
    />
  )
}
