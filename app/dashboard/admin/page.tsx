import { DollarSign, GraduationCap, ListChecks, Users } from "lucide-react"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import { getServerSession } from "@/lib/serverSession"

export default async function AdminOverviewPage() {
  // TODO: fetch these platform-wide
  const session = await getServerSession()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
    headers: {
      "Content-Type": "application/json",
      // Add any necessary authentication headers here
    },
  })
  const result = await res.json()
  console.log("Admin stats result:", result) // Log the fetched data for debugging
  const data = {
    users: result.users,
    tutors: result.tutors,
    pending: result.pending,
    approved: result.approved,
    revenue: 0,
  }

  return (
    <DashboardOverview
      title="Admin"
      highlight="overview"
      description="Platform statistics."
      stats={[
        {
          label: "Total users",
          value: data.users,
          icon: Users,
          color: "lilac",
          href: "/dashboard/admin/users",
        },
        {
          label: "Total tutors",
          value: data.tutors,
          icon: GraduationCap,
          color: "sky",
          href: "/dashboard/admin/users?status=tutor",
        },
        {
          label: "Pending vs approved tuitions",
          value: `${data.pending} / ${data.approved}`,
          icon: ListChecks,
          color: "lemon",
          href: "/dashboard/admin/tuitions",
        },
        {
          label: "Total Stripe revenue",
          value: `$${data.revenue.toLocaleString("en-US")}`,
          icon: DollarSign,
          color: "mint",
          href: "/dashboard/admin/transactions",
        },
      ]}
    />
  )
}
