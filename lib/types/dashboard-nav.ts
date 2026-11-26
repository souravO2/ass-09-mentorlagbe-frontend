import {
  Bookmark,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  SquarePlus,
  UserPen,
  Users,
  type LucideIcon,
} from "lucide-react"

export type Role = "student" | "tutor" | "admin"

type NavItem = { href: string; label: string; icon: LucideIcon }

const profile: NavItem = {
  href: "/profile",
  label: "Update Profile",
  icon: UserPen,
}

export const dashboardNav: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/student/my-applications",
      label: "My Applications",
      icon: FileText,
    },
    {
      href: "/dashboard/student/saved",
      label: "Saved Tuitions",
      icon: Bookmark,
    },
    profile,
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/tutor/post-tuition",
      label: "Post Tuition",
      icon: SquarePlus,
    },
    {
      href: "/dashboard/tutor/my-tuitions",
      label: "My Tuitions",
      icon: BookOpen,
    },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: Users },
    profile,
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    {
      href: "/dashboard/admin/tuitions",
      label: "Tuitions",
      icon: ClipboardCheck,
    },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: CreditCard,
    },
    profile,
  ],
}
